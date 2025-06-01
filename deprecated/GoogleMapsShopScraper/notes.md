# 🗒️ Deprecation Notes – Google Maps Shop Scraper

## 🧾 Summary

This tool was designed to scrape business listings from a specified Google Maps URL. It:

- Loaded local search results from Google Maps
- Extracted business data directly from those listings
- Visited each shop’s website to gather additional information such as emails, fishing reports, and other contact details

## ❌ Why It's Being Deprecated

Directly scraping Google Maps is a violation of [Google's Terms of Service](https://mapsplatform.google.com/terms/). After learning this, we decided to phase out this approach to remain compliant and reduce the risk of service disruption or legal issues.

## 🔄 Replacement

The new **Shop Scraper** tool replaces this functionality by:

- Using [SerpAPI](https://serpapi.com/) to retrieve business listing data in a compliant manner
- Reusing much of the website-parsing logic from this tool (e.g. scraping emails and fishing report links)

## 🕓 Status

This tool is **not yet deprecated**, but is scheduled for deprecation once the SerpAPI-based solution reaches full parity in terms of functionality.

## 🗂️ Files Worth Preserving

If anything from this tool needs to be salvaged:

- Logic for crawling and parsing shop websites
- Email detection heuristics
- Fishing report keyword matching

Once fully deprecated, this folder will remain here for historical reference but should not be updated further.
