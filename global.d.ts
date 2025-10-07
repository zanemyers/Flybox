// Declare custom methods on top of the default Playwright Page
import type { Response } from "playwright";
declare module "playwright" {
  interface Page {
    // Common helpers (used everywhere)
    simulateUserInteraction(): Promise<void>;
    load(url: string, retries?: number): Promise<Response | null>;
    getAttByLocator(locator: string, attribute: string, filter?: object): Promise<string | null>;
    getAttByLabel(label: string, attribute: string, filter: object): Promise<string | null>;
    getTextContent(locator: string, filter: object): Promise<string | null>;
    hasElementWithKeyword(element: string, keyword: string): Promise<boolean>;

    // Optional scraper-specific helpers (if you want them global)
    publishesFishingReport?(): Promise<boolean | string>;
    getSocialMedia?(): Promise<string | string[]>;
    getContactLink?(): Promise<string | null>;
    getEmailFromHref?(): Promise<string | null>;
    getEmailFromText?(): Promise<string | null>;
    getEmail?(onContactPage?: boolean): Promise<string>;
    hasOnlineShop?(): Promise<boolean | string>;
  }
}

// Ensure a single PrismaClient instance is used throughout the app.
import { PrismaClient } from "@prisma/client";
declare global {
  var prisma: PrismaClient | undefined;
}

export {};
