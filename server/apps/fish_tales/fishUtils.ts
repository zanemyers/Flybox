import * as chrono from "chrono-node";

import type { GoogleGenAI } from "@google/genai";

import { DIVIDER } from "../base/constants";
import { normalizeUrl } from "../base";
import { Page } from "playwright";

import { type Site } from "./fishTales";

/** Normalize URLs for each site and remove duplicates based on the normalized URLs. */
async function checkDuplicateSites(sites: Site[]): Promise<Site[]> {
  const urlsSet = new Set(); // Normalized URLs that have been processed
  const siteList = []; // Unique site objects with normalized URLs

  for (const site of sites) {
    const url = normalizeUrl(site.url);

    if (!urlsSet.has(url)) {
      urlsSet.add(url);
      siteList.push({ ...site, url }); // Add a copy of the site object with the normalized URL
    } else {
      console.warn("Duplicate found:", url); // Log duplicate URLs
    }
  }
  return siteList;
}

/** Checks whether the target string contains any of the specified terms, case-insensitively. */
function includesAny(target: string, terms: string[]): boolean {
  return terms.some((term) => target.toLowerCase().includes(term.toLowerCase()));
}

export interface Anchor {
  href: string;
  linkText: string;
}

/** Retrieves all anchor (`<a>`) elements with an `href` attribute from the page, */
async function extractAnchors(page: Page): Promise<Anchor[]> {
  return await page.$$eval("a[href]", (anchors) =>
    anchors
      .filter((a): a is HTMLAnchorElement => a instanceof HTMLAnchorElement) // type guard
      .map((a) => ({
        href: a.href,
        linkText: a.textContent?.toLowerCase().trim() || "",
      }))
  );
}

/** Scrapes the visible text content from the first element that matches the specified CSS selector. */
async function scrapeVisibleText(page: Page, selector: string): Promise<string | null> {
  const element = await page.$(selector);
  if (!element) return null;

  // Evaluate visibility and extract text within the browser context
  return await element.evaluate((node) => {
    if (!(node instanceof HTMLElement)) return null; // Narrow to HTMLElement

    const style = window.getComputedStyle(node);
    const isVisible =
      style.display !== "none" && style.visibility !== "hidden" && node.offsetParent !== null;

    // If visible, return trimmed innerText with consecutive newlines replaced by single newlines
    return isVisible ? node.innerText.trim().replace(/\n{2,}/g, "\n") : null;
  });
}

/** Determines the priority score for a hyperlink to guide scraping order. */
function getPriority(currentUrl: string, link: string, linkText: string, siteInfo: Site): number {
  const currentUrlHasKeyword = includesAny(currentUrl, siteInfo.keywords); // Check if current URL contains keywords
  const hasKeyword = includesAny(link, siteInfo.keywords); // Check if link URL contains keywords
  const hasJunkWord = includesAny(link, siteInfo.junkWords); // Check if link URL contains junk words
  const hasClickPhrase = includesAny(linkText, siteInfo.clickPhrases); // Check if anchor text contains click phrases

  let priority = Infinity; // Default: do not follow

  if (hasKeyword && !hasJunkWord) {
    priority = 0; // Highest priority: relevant link without junk words
  } else if (currentUrlHasKeyword && hasClickPhrase) {
    priority = 1; // Medium priority: current URL relevant and link text invites clicking
  } else if (hasKeyword && hasJunkWord) {
    priority = 2; // Low priority: relevant link but contains junk terms
  }

  return priority;
}

/** Parses text to find explicit date expressions and returns the most recent valid date within a set range. */
function extractDate(text: string): Date | null {
  const currentYear = new Date().getFullYear();

  // Parse all date expressions using chrono-node
  const results = chrono.parse(text);

  // Extract valid dates, filter by range, sort by recency
  const validDates = results
    .filter((result) => result.start.isCertain("year")) // Only dates with explicit years
    .map((result) => result.start.date())
    .filter((date) => {
      const year = date.getFullYear();
      return year >= 2020 && year <= currentYear;
    })
    .sort((a, b) => b.getTime() - a.getTime()); // most recent first

  return validDates[0] || null;
}

/** Estimates the approximate number of tokens in the given text. */
function estimateTokenCount(text: string): number {
  // Split the trimmed text into words by whitespace
  const words = text?.trim()?.split(/\s+/).length || 0;
  return Math.ceil(words * 1.3); // Multiply the word count by 1.3 and round up
}

/** Splits the full report text into smaller chunks, each staying within the token limit. */
function chunkReportText(text: string, tokenLimit: number): string[] {
  const reports = text.split(DIVIDER);
  const chunks = []; // Array to hold resulting text chunks

  let currentChunk = ""; // Holds the accumulated text for the current chunk
  let currentTokens = 0; // Estimated token count of currentChunk

  for (const report of reports) {
    // Re-add DIVIDER to preserve section separation in chunks
    const section = report + DIVIDER;
    const tokens = estimateTokenCount(section);

    // If adding this section exceeds token limit, push current chunk and start a new one
    if (currentTokens + tokens > tokenLimit) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
      }
      currentChunk = section; // Start new chunk with current section
      currentTokens = tokens;
    } else {
      // Otherwise, append section to current chunk
      currentChunk += section;
      currentTokens += tokens;
    }
  }

  // Add any remaining chunk after loop ends
  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

/** Generates text content from the Google GenAI model based on the given prompt. */
async function generateContent(ai: GoogleGenAI, model: string, prompt: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
  });

  return response?.text?.trim() || "";
}

export {
  checkDuplicateSites,
  chunkReportText,
  estimateTokenCount,
  extractAnchors,
  extractDate,
  generateContent,
  getPriority,
  includesAny,
  scrapeVisibleText,
};
