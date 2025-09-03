### Changelog

All notable changes to this project will be documented in this file.

### [v3.5](https://github.com/zanemyers/RescueRiver/compare/v3.4..HEAD) — 3 Sep 2025

#### **Changed**
- Renamed the **CLI & Environment** section to **Environment** in [`docs/setup.md`](./setup.md).
- Simplified `.env` generation logic in `setup.js`.

#### **Removed**
- Deleted unused dependencies from [`package.json`](../package.json) and `package-lock.json`.
- Removed outdated packages from [`docs/setup.md`](./setup.md).

### [v3.4](https://github.com/zanemyers/RescueRiver/compare/v3.3..v3.4) — _3 Sep 2025_

#### **Added**
- Added new images for documentation for FishTales, ShopReel, and SiteScout.
- Added `.docs` layout for sidebar and content area to [SCSS](../static/scss/style.scss).
- Added documentation pages in [`views/apps/docs/`](../views/apps/docs):
    - [`docs.ejs`](../views/apps/docs.ejs) — tabbed layout for ShopReel, FishTales, and SiteScout documentation.
    - [`fish_tales_doc.ejs`](../views/apps/docs/fish_tales_doc.ejs) — FishTales Documentation.
    - [`shop_reel_doc.ejs`](../views/apps/docs/shop_reel_doc.ejs) — ShopReel Documentation.
    - [`site_scout_doc.ejs`](../views/apps/docs/site_scout_doc.ejs) — SiteScout Documentation.

#### **Changed**
- Renamed `report_starter_file_ex.xlsx` → [`fishTales_starter_file.xlsx`](../static/example_files/fishTales_starter_file.xlsx).
- Renamed `routes/_partials.js` → [`routes/_forms.js`](../routes/_forms.js).
- Moved [`idea.jpg`](../static/images/about/idea.jpg), [`important.jpg`](../static/images/about/important.jpg), [`serve.jpg`](../static/images/about/serve.jpg) to [`about/`](../static/images/about).
- Updated CSS/SCSS to improve readability.
- Simplified text in instructions panel and updated links to point to documentation.
- **Moved files:**
    - Form partials to [`views/apps/forms/`](../views/apps/forms):
        - [`fish_tales_form.ejs`](../views/apps/forms/fish_tales_form.ejs)
        - [`shop_reel_form.ejs`](../views/apps/forms/shop_reel_form.ejs)
        - [`site_scout_form.ejs`](../views/apps/forms/site_scout_form.ejs)
    - Main tool views to [`views/apps/`](../views/apps):
        - [`fish_tales.ejs`](../views/apps/fish_tales.ejs)
        - [`shop_reel.ejs`](../views/apps/shop_reel.ejs)
        - [`site_scout.ejs`](../views/apps/site_scout.ejs)
- Updated Express routes to reflect new file locations.

### [v3.3](https://github.com/zanemyers/RescueRiver/compare/v3.2..v3.3) — _25 Aug 2025_

#### **Added**

- **SiteScout**:
  - WebSocket ([`/ws/site-scout`](../server.js)) with [`siteScoutSocket`](../sockets/_siteScoutSocket.js) for handling `shopReel` + `fishTales` files.
  - Frontend: [`siteScoutFormApp.js`](../static/js/siteScoutFormApp.js), [`site_scout_form.ejs`](../views/apps/forms/site_scout_form.ejs) partial, and [`site_scout.ejs`](../views/apps/site_scout.ejs) page.

#### **Changed**

- **Sockets**: `reportSocket` → [`fishTalesSocket`](../sockets/_fishTalesSocket.js), `shopSocket` → [`shopReelSocket`](../sockets/_shopReelSocket.js).
- **Routes**: `/shop-form` → [`/shop-reel-form`](../routes/_apps.js), `/report-form` → [`/fish-tales-form`](../routes/_apps.js).
- **Server**: WebSocket routes moved to [`/ws/shop-reel`](../server.js), [`/ws/fish-tales`](../server.js).
- [**BaseFormApp**](../static/js/baseFormApp.js): WebSocket port fixed at `3000` (was `process.env.PORT`).
- **SiteScout logic**: [`mergeMissingUrls`](../apps/site_scout/siteDiff.js) now accepts in-memory buffers, supports cancellation, returns updated starter files.
- [**File input**](../static/js/fileInput.js): refactored for independent components (`.file-input-component`), simplified partials, and per-component init.
- **Forms**: `reportFormApp.js` → [`fishTalesFormApp.js`](../static/js/fishTalesFormApp.js), `shopFormApp.js` → [`shopReelFormApp.js`](../static/js/shopReelFormApp.js).
- [**SCSS**](../static/scss/style.scss): restructured styles for `.file-input-component` (better drag-drop + file display).
- [**Map UI**](../static/js/map.js): switched lat/lng handling to `input[name="latitude"]` / `input[name="longitude"]`.
- **Views**:
  - Updated wording in [`fish_tales.ejs`](../views/apps/fish_tales.ejs) + [`shop_reel.ejs`](../views/apps/shop_reel.ejs) (fly-fishing focus, privacy notices).
  - [`index.ejs`](../views/index.ejs) SiteScout button text: _Coming Soon_ → _Check your sites_.
  - [`header.ejs`](../views/partials/header.ejs) menu renamed to **SiteScout**.
- **Docs**: refreshed [`README.md`](../README.md), [`setup.md`](./setup.md), and [`config.md`](./config.md).

#### **Removed**

- Legacy `rr_logo.png`.
- Old socket files `_reportSocket.js`, `_shopSocket.js`.
- Redundant IDs in `file_input.ejs` (class-based now).

### [v3.2](https://github.com/zanemyers/RescueRiver/compare/v3.1..v3.2) — _21 Aug 2025_

#### **Added**

- New [**Index**](../views/index.ejs) page with hero section and cards for **ShopReel**, **FishTales**, **SiteScout**, and **Docs**.
- New [**About**](../views/about.ejs) page with supporting images:
  - `static/images/idea.jpg`
  - `static/images/important.jpg`
  - `static/images/serve.jpg`
- Reusable [**Card partial**](../views/partials/card.ejs) supporting slim and normal layouts.
- **Navbar** enhancement: dropdown toggles highlight when one of their items matches the current path.
- **SiteScout** section and feature list added in the [Overview docs](./overview.md).
- New **Packages** in the [Setup docs](./setup.md):
  - `TinyQueue` under _Async Control_
  - `Express`, `Express-EJS-Layouts`, and `EJS` under _Server & Templates_
  - `ws` under _WebSockets_

#### **Changed**

- Branding & routes:
  - `report_scraper` → **FishTales**
  - `shop_scraper` → **ShopReel**
  - `site_diff` → **SiteScout**
- Renamed EJS views & form partials:
  - `views/report_scraper.ejs` → `views/fish_tales.ejs`
  - `views/shop_scraper.ejs` → `views/shop_reel.ejs`
  - `views/partials/report_form.ejs` → `views/partials/fish_tales_form.ejs`
  - `views/partials/shop_form.ejs` → `views/partials/shop_reel_form.ejs`
- Docs refreshed for new names and clearer known issues ([README](../README.md), [Overview](./overview.md), [Setup](./setup.md)).
- [**Compose**](../compose.yaml):
  - service `fly-box` → `flybox`
  - added `PORT` env var
  - switched port mapping to `"${PORT}:3000"`
- [**BaseFormApp**](../static/js/baseFormApp.js): WebSocket URL now uses `process.env.PORT` instead of hardcoded `3000`.
- [**Header**](../views/partials/header.ejs): updated with larger logo, “Flybox” branding, and a “More” dropdown.
- [**Footer**](../views/partials/footer.ejs): simplified styling.
- [**Layout**](../views/layouts/base.ejs): favicon updated from `fishing_pole.ico` to `tackle_box.png`.

#### **Removed**

- Legacy favicon `static/images/fishing_pole.ico`.

### [v3.1](https://github.com/zanemyers/RescueRiver/compare/v3.0..v3.1) — _19 Aug 2025_

#### **Added**

- Conditional API key handling in scrapers for development (`process.env.GEMINI_API_KEY`).
- Live Sass Compiler auto-compilation setup in VS Code.
- Compound debugger configuration combining local and Docker.

#### **Changed**

- Updated asset paths in EJS templates and `server.js` to use `/static`.
- VS Code debugging and settings updated for Sass and Node attach.
- Docker service renamed to `fly-box`.

#### **Removed**

- Redundant static file references in templates.

### [v3.0](https://github.com/zanemyers/RescueRiver/compare/v2.3..v3.0) — _19 Aug 2025_

#### **Added**

- `.env`, `.vscode/`, `.idea/`, `.git/`, `.gitignore` entries to `.dockerignore`
- **SCSS formatting** via `stylelint` with custom `.stylelintrc`
- Centralized `index` files for simpler imports
- `getBuffer` method in `TXTFileHandler` & `ExcelFileHandler`; `loadBuffer` in `ExcelFileHandler`
- `_setupRequestInterception` in `StealthBrowser`
- Debugging & running ports in `compose.yaml`
- `build_styles` and `start` Just commands
- New dependencies: `bootstrap`, `ejs`, `express`, `express-ejs-layouts`, `tinyqueue`, `ws`
- New dev dependencies: `sass`, `stylelint`, `stylelint-config-standard`, `stylelint-config-standard-scss`, `stylelint-scss`
- New example and image assets in `static/` and `docs/images/`
- `server.js` for Express web server with internal WebSocket support
- Expanded routes (`_apps.js`, `_index.js`, `_forms.js`, `_test.js`, `error.js`)
- WebSocket handlers (`_baseWebSocket.js`, `_cancellationToken.js`, `_reportSocket.js`, `_shopSocket.js`)
- Frontend scripts (`baseFormApp.js`, `fileInput.js`, `map.js`, `navbar.js`, `reportFormApp.js`, `shopFormApp.js`, `tooltip.js`)
- SCSS styles (`_theme.scss`, `style.scss`) and compiled CSS
- EJS views (`index`, `about`, `error`, `report_scraper`, `shop_scraper`) and layouts/partials

#### **Changed**

- Added/updated comments across most files
- Updated `Dockerfile` to expose local port & include run command
- Revised `README` and documentation (`config.md`, `ide.md`, `overview.md`, `setup.md`)
- Renamed all `Util` files to private `_...Utils`
- Moved `base`, `report_scraper`, `shop_scraper`, `site_diff` into `apps/`
- Updated file handlers for in-memory file operations
- Renamed `_customActions` → `_enhancePageLoad`
- Split `enums.js` into multiple constants files (`_messages.js`, `_prompts.js`, `_scrapers.js`, `_shopScraper.js`)
- Moved `example_files/` into `static/`
- Updated ESLint config and `just lint` to also lint SCSS
- Renamed `ResucueRiverLogo.png` → `rr_logo.png` and moved to `docs/images/`
- Updated setup script for simplified `.env`
- Enhanced `shopScraper` and `reportScraper` to accept form input and support cancellation

#### **Removed**

- Deprecated: `getUTCYearMonth`, `getUTCTimeStamp`, `FileHandler`, `loadCachedShops`
- Removed: `report_urls.txt`, `shops.json`, `index.md`, `usage.md`, `assets/`
- Dropped Just commands for running scrapers individually

### [v2.3](https://github.com/zanemyers/RescueRiver/compare/v2.2...v2.3) — _30 June 2025_

#### ✨ Added

- `.env` variables: `SEARCH_RADIUS`, `CRAWL_DEPTH`
- `siteDiff.js`: compares shop and report Excel files, appends missing sites to the report
- Spinner status messages for report scraper
- Dev dependencies: `@eslint/js`, `eslint`, `eslint-config-prettier`, `eslint-plugin-prettier`, `globals`, `prettier`
- `just format` and `just lint` commands
- ESLint config file and Prettier config/ignore files
- `ide.md` documentation
- Base `write` method to `FileHandler`
- `read` method for `TXTFileHandler`
- `BLOCKED_FORBIDDEN` keywords to `enums.js`

#### Changed

- Renamed `ShopScraper` & `ReportScraper` to `shop_scraper` & `report_scraper`
- `.env` updates:
  - `SEARCH_COORDINATES` split into `SEARCH_LAT` & `SEARCH_LONG`
  - `GOOGLE_GENAI_API_KEY` & `GOOGLE_GENAI_MODEL` renamed to `GEMINI_API_KEY` & `GEMINI_MODEL`
- `env.js` updated for new `.env` keys
- Report scraper now reads sites from Excel instead of JSON
- Summary generation skipped if no reports found
- Report scraper now uses `StealthBrowser`
- Failed sites are logged for review
- Moved `example_files` out of `assets`
- All URLs in `shops.json` normalized to `https`
- Docs updated: `usage`, `setup`, `overview`, `config`
- Renamed `docker-compose.yaml` to `compose.yaml`
- Improved `page.load` with retry support and skip on block
- Enhanced `ExcelFileHandler.read()` to support list columns
- Updated `ExcelFileHandler.write()` to support appending or archiving
- Refined AI prompts: `SUMMARY_PROMPT`, `MERGE_PROMPT`
- Renamed `extractMostRecentDate` to `extractDate`
- Updated `.gitignore` and `.dockerignore`

#### Removed

- `isSameDomain` from `reportUtils` (replaced by `sameDomain` in `scrapingUtils`)
- Site comparison tool section from README (now part of report scraper)

### [v2.2](https://github.com/zanemyers/RescueRiver/compare/v2.1...v2.2) — _18 June 2025_

#### Added

- Integrated `playwright-extra` and `puppeteer-extra-plugin-stealth` packages.
- Introduced `StealthBrowser` class in `scrapingUtils.js` for more human-like scraping behavior.

#### Changed

- Upgraded `playwright` package.
- Moved `deprecated/` directory into `docs/` for better organization.
- Simplified fishing report detection logic.
- Fixed contact link extraction to resolve full (absolute) URLs.
- Improved email scraping accuracy and robustness.
- Switched shop scraper to use `StealthBrowser` instead of default Playwright browser.

### [v2.1](https://github.com/zanemyers/RescueRiver/compare/v2.0...v2.1) — _2 June 2025_

#### Added

- Added `ora` package for terminal spinner functionality
- Added `.vscode/settings.json` to exclude folders from search results

#### Changed

- Replaced `terminalUtils` spinner and progress bar with `ora`-based implementation
- Updated setup documentation packages to include `ora`
- Updated base deprecation notes for v2.1

#### Removed

- Deprecated `Spinner` class and `progressBar` function from `base/terminalUtils`
- Removed Excel index column from `shop_details.xlsx`

### [v2.0](https://github.com/zanemyers/RescueRiver/compare/v1.1...v2.0) — _2 June 2025_

#### Added

- Added `ShopScraper` application and new packages: `exceljs`, `serpapi`, and `@supercharge/promise-pool`
- Introduced `ExcelFileHandler` class (extends `FileHandler`) with `read` and `write` support
- Added `FALLBACK_DETAILS` to project constants
- Added example files under `assets/`
- Added `loadCachedShops` and `buildShopRows` to `shopUtils`

#### Updated

- Refactored `startSpinner` and `stopSpinner` into unified `Spinner` class
- Renamed `FileWriter` to `FileHandler`; it now uses the file path's base name for archiving
- Renamed `FishingReportScraper` to `ReportScraper`
- Updated ReportScraper to use `.env` variables and `ExcelFileHandler`
- Updated setup script and documentation (setup, config, overview) to reflect scraper changes

#### Removed

- Deprecated `CSVFileWriter`, `CSVFileReader`, and `GoogleMapsShopScraper`
- Removed unnecessary constants and page selectors from `shopUtils`

### [v1.1](https://github.com/zanemyers/RescueRiver/compare/v1.0...v1.1) — _1 June 2025_

#### Added

- Added Changelog
- Added documentation folder
- Added Deprecation folder

#### Updated

- Simplified ReadMe

### [v1.0](https://github.com/zanemyers/RescueRiver/compare/v0.0...v1.0)
