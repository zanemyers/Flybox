import "dotenv/config";
import { PromisePool } from "@supercharge/promise-pool";
import { GoogleGenAI } from "@google/genai";
import TinyQueue from "tinyqueue";
import { differenceInDays } from "date-fns";

import { DIVIDER, ERRORS } from "../base/constants";
import {
  BaseApp,
  ExcelFileHandler,
  normalizeUrl,
  sameDomain,
  StealthBrowser,
  TXTFileHandler,
} from "../base";

import {
  checkDuplicateSites,
  chunkReportText,
  extractAnchors,
  extractDate,
  generateContent,
  getPriority,
  includesAny,
  scrapeVisibleText,
  type Anchor,
} from "./fishUtils";
import { JobStatus } from "@prisma/client";

interface SearchParams {
  apiKey: string;
  maxAge: number;
  filterByRivers: boolean;
  riverList: string[];
  file: Express.Multer.File;
  includeSiteList: boolean;
  tokenLimit: number;
  crawlDepth: number;
  model: string;
  summaryPrompt: string;
  mergePrompt: string;
}

export interface Site {
  url: string;
  selector: string;
  lastUpdated: string;
  keywords: string[];
  junkWords: string[];
  clickPhrases: string[];
}

/**
 * FishTales class handles scraping fishing reports from websites listed in a starter file,
 * filters them by date and content, and produces a summarized report using Gemini AI.
 *
 * Extends BaseApp to integrate with the job system (progress tracking,
 * cancellation, messages, and file attachments).
 */
export class FishTales extends BaseApp {
  protected searchParams: SearchParams;
  protected starterFileHandler: ExcelFileHandler = new ExcelFileHandler();
  protected siteListHandler: TXTFileHandler = new TXTFileHandler();
  protected summaryHandler: TXTFileHandler = new TXTFileHandler();
  protected browser: StealthBrowser = new StealthBrowser();
  protected failedDomains: string[] = [];

  constructor(jobId: string, searchParams: SearchParams) {
    super();
    this.jobId = jobId;
    this.searchParams = searchParams;
  }

  /** Orchestrates the FishTales job: */
  async reportScraper() {
    try {
      // STEP 1: Read and deduplicate sites
      await this.addJobMessage("Reading Sites from file...");
      await this.starterFileHandler.loadBuffer(this.searchParams.file.buffer);
      await this.throwIfJobCancelled();

      const sites: Site[] = await this.starterFileHandler.read<Site>([
        "keywords",
        "junkWords",
        "clickPhrases",
      ]);

      const siteList = await checkDuplicateSites(sites);
      await this.addJobMessage(`✅ Found ${siteList.length} sites to scrape!`, true);
      await this.throwIfJobCancelled();

      // STEP 2: Scrape reports from sites
      const reports = await this.scrapeReports(siteList);
      await this.throwIfJobCancelled();

      // STEP 3: Filter and compile reports
      if (reports.length > 0) {
        await this.addJobMessage("Compiling reports...");
        const filteredReports = this.filterReports(reports);
        await this.throwIfJobCancelled();

        const compiledReports = filteredReports.join(DIVIDER);
        await this.addJobMessage("✅ Compiling complete!", true);

        // STEP 4: Summarize compiled reports with Gemini
        await this.addJobMessage("Generating report summary...");
        await this.generateSummary(compiledReports);

        if (this.failedDomains.length) {
          console.warn(`Failed Pages\n${this.failedDomains.join("\n")}`);
        }

        await this.addJobMessage("✅ Finished!", true);
        await this.updateJobStatus(JobStatus.COMPLETED);
      }
    } catch (err) {
      if (err instanceof Error && err.message !== ERRORS.CANCELLED) {
        await this.addJobMessage(`❌ Error: ${err.message || err}`);
        await this.updateJobStatus(JobStatus.FAILED);
      }
    }
  }

  /** Scrape reports from multiple sites concurrently. */
  async scrapeReports(sites: Site[]): Promise<string[]> {
    let completed = 0;
    const messageTemplate = (done: number) =>
      `Scraping sites (${done}/${sites.length}) for reports...`;

    try {
      await this.browser.launch();
      await this.addJobMessage(messageTemplate(completed));

      // Run site scraping in parallel with controlled concurrency
      const { results } = await PromisePool.withConcurrency(this.concurrency)
        .for(sites)
        .process(async (site) => {
          await this.throwIfJobCancelled();

          try {
            const reports = await this.findReports(site);
            await this.addJobMessage(messageTemplate(++completed), true);
            return reports;
          } catch (err) {
            if (err instanceof Error) {
              if (err.message !== ERRORS.CANCELLED) throw err; // Bubble-up
              this.failedDomains.push(`Error scraping ${site.url}: ${err.message || err}`);
            }
            return [];
          }
        });

      await this.throwIfJobCancelled();

      // Flatten nested arrays and remove empty entries
      const reports = (results ?? []).flat().filter(Boolean);
      await this.addJobMessage(`✅ Found ${reports.length} total reports!`, true);

      // Save site list if requested
      if (this.searchParams.includeSiteList) {
        await this.addJobFile("secondaryFile", this.siteListHandler.getBuffer());
      }

      return reports;
    } catch (err) {
      if (err instanceof Error && err.message !== ERRORS.CANCELLED) throw err; // Bubble-up
      await this.addJobMessage(`❌ Error: ${err}`, true);
      return [];
    } finally {
      await this.browser.close(); // Ensure browser shuts down regardless of success/failure
    }
  }

  /** Crawl a single site to extract report texts. */
  async findReports(site: Site): Promise<string[]> {
    const page = await this.browser.newPage();
    const reports: string[] = []; // Collected report texts
    const visited = new Set(); // URLs already visited
    const toVisit = new TinyQueue<{ url: string; priority: number }>( // Priority queue for URLs to visit
      [],
      (a, b) => a.priority - b.priority
    );

    // Seed with the starting page; lower priority number means higher priority
    toVisit.push({ url: site.url, priority: -1 });
    while (toVisit.length > 0 && visited.size < this.searchParams.crawlDepth) {
      await this.throwIfJobCancelled();

      const url = toVisit.pop()?.url; // Get the next highest priority URL
      if (!url || visited.has(url)) continue;
      visited.add(url);

      // Navigate to the page
      try {
        await page.load(url);
      } catch (err) {
        if (err instanceof Error)
          this.failedDomains.push(`Error navigating to ${url}:: ${err.message || err}`);
        continue;
      }

      // Scrape visible content from subpages (not the homepage)
      if (url !== site.url) {
        await page.waitForSelector("body", { timeout: 10000 }).catch(() => {});
        const text = await scrapeVisibleText(page, site.selector);
        if (text) {
          reports.push(`${text}\nSource: ${url}`);
        }
      }

      // Extract all anchor links from the page
      const pageLinks: Anchor[] = await extractAnchors(page);

      for (const { href, linkText } of pageLinks) {
        if (!sameDomain(href, site.url)) continue;

        const link = normalizeUrl(href);
        if (visited.has(link)) continue;

        const priority = getPriority(url, link, linkText, site);
        if (priority !== Infinity) {
          toVisit.push({ url: link, priority });
        }
      }
    }

    // Save crawl info if site list output is enabled
    if (this.searchParams.includeSiteList) {
      const visitedText = [...visited].map((site) => `\t${site}`).join("\n");
      const toVisitText = toVisit.data.map((item) => `\t${item.url}`).join("\n");

      if (visited.size >= this.searchParams.crawlDepth) {
        await this.siteListHandler.write("Reached crawl depth limit for this site.\n", true);
      }

      await this.siteListHandler.write(
        `VISITED:\n${visitedText}\nTO VISIT:\n${toVisitText}\n${DIVIDER}\n`,
        true
      );
    }

    page.close();
    return reports;
  }

  /** Filter reports by recency, detected date, and optional river list. */
  filterReports(reports: string[]): string[] {
    const today = new Date();

    return reports.filter((report) => {
      const reportDate = extractDate(report);

      if (!reportDate) return false; // Excludes reports with no detectable date.
      if (differenceInDays(today, reportDate) > this.searchParams.maxAge) return false; // Excludes reports older than `maxAge` days.

      // Optionally requires mention of a river from `riverList`.
      return !(
        this.searchParams.filterByRivers && !includesAny(report, this.searchParams.riverList)
      );
    });
  }

  /** Generate a summarized report using Gemini AI. */
  async generateSummary(report: string): Promise<void> {
    // If the API key is set to "test" in dev mode, use GEMINI_API_KEY from env
    const apiKey =
      this.searchParams.apiKey === "test" && process.env.NODE_ENV === "development"
        ? process.env.GEMINI_API_KEY
        : this.searchParams.apiKey;

    const ai = new GoogleGenAI({ apiKey: apiKey });

    try {
      // Split report into chunks respecting token limits
      const chunks = chunkReportText(report, this.searchParams.tokenLimit);

      // Summarize each chunk concurrently
      const { results, errors } = await PromisePool.withConcurrency(this.concurrency)
        .for(chunks)
        .process(async (chunk) => {
          await this.throwIfJobCancelled();
          return await generateContent(
            ai,
            this.searchParams.model,
            `${chunk}\n\n${this.searchParams.summaryPrompt}`
          );
        });

      if (errors.length > 0) {
        console.warn("Some summaries failed:", errors);
      }

      if (results.length === 0) {
        await this.addJobMessage("❌ No summaries generated. Skipping final summary.", true);
        return;
      }

      await this.throwIfJobCancelled();

      // Merge chunk summaries into a final summary
      const finalResponse = await generateContent(
        ai,
        this.searchParams.model,
        `${this.searchParams.mergePrompt}\n\n${results.join("\n\n")}`
      );

      // Save the final summary to a text file and attach it's buffer as the job's primary file
      await this.summaryHandler.write(finalResponse);
      await this.addJobFile("primaryFile", this.summaryHandler.getBuffer());
    } catch (err) {
      if (err instanceof Error && err.message !== ERRORS.CANCELLED) throw err; // Bubble-up
      await this.addJobMessage(`❌ Error generating summary: ${err}`, true);
    }
  }
}
