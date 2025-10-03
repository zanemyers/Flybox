### Changelog

All notable changes to this project will be documented in this file.

### [v4.1](https://github.com/zanemyers/RescueRiver/compare/v4.0..v4.1) — _2 Oct 2025_

#### **Added**
- `BaseForm` now automatically initializes Bootstrap tooltips on all form inputs.
    - Tooltips initialized on initial mount (`componentDidMount`) and after updates (`componentDidUpdate`).

#### **Changed**
- `README.md` logo updated to use `client/public/images/tb_icon.ico` instead of the old static image.


### [v4.0](https://github.com/zanemyers/RescueRiver/compare/v3.7..v4.0) — _2 Oct 2025_

#### Added

- **Base utilities & API**
  - `apps/base/_baseAPI.ts`
  - `apps/base/_baseApp.ts`
  - `apps/fish_tales/fishAPI.ts`
  - `apps/shop_reel/shopAPI.ts`
  - `apps/site_scout/siteAPI.ts`
- **React client entry & routing**
  - `client/index.html`
  - `client/src/App.tsx`
  - `client/src/main.tsx`
- **Documentation pages**
  - `client/src/components/docs/fishTalesDoc.tsx`
  - `client/src/components/docs/shopReelDoc.tsx`
  - `client/src/components/docs/siteScoutDoc.tsx`
- **React form components**
  - `client/src/components/forms/components/baseForm.tsx`
  - `client/src/components/forms/components/fileInput.tsx`
  - `client/src/components/forms/components/formInput.tsx`
  - `client/src/components/forms/components/mapInput.tsx`
  - `client/src/components/forms/components/progressPanel.tsx`
- **React Forms**
  - `client/src/components/forms/fishTalesForm.tsx`
  - `client/src/components/forms/shopReelForm.tsx`
  - `client/src/components/forms/siteScoutForm.tsx`
- **React Layout**
  - `client/src/components/layout/footer.tsx`
  - `client/src/components/layout/header.tsx`
  - `client/src/components/layout/layout.tsx`
  - `client/src/components/layout/navbar.tsx`
- **React UI Components**
  - `client/src/components/ui/card.tsx`
  - `client/src/components/ui/images.tsx`
  - `client/src/components/ui/links.tsx`
  - `client/src/components/ui/listBlock.tsx`
  - `client/src/components/ui/sections.tsx`
  - `client/src/components/ui/sideBar.tsx`
  - `client/src/components/ui/tableOfContents.tsx`
  - `client/src/components/ui/tabs.tsx`
- **Pages**
  - `client/src/pages/about.tsx`
  - `client/src/pages/docs.tsx`
  - `client/src/pages/error.tsx`
  - `client/src/pages/fishTales.tsx`
  - `client/src/pages/home.tsx`
  - `client/src/pages/shopReel.tsx`
  - `client/src/pages/siteScout.tsx`
- **React Routing**
  - `client/src/pages/index.tsx`
- **Packages**
  - `leaflet`, `multer`, `react`, `react-bootstrap`, `react-dom`, `react-leaflet`, `react-markdown`, `react-router-dom`
- **Database**
  - `schema.prisma`
  - `models/job.prisma`
  - `db.ts`

#### Changed

- **Configuration**
  - Updated `.dockerignore` & `.gitignore` for logs, editor files, and `/server/db/dev.db`
- **Renamed files**
  - `apps/fish_tales/reportScraper.js → apps/fish_tales/fishTales.ts`
  - `apps/shop_reel/shopScraper.js → apps/shop_reel/shopReel.ts`
  - `apps/site_scout/siteDiff.js → apps/site_scout/siteScout.ts`
  - `apps/fish_tales/reportUtils.js → apps/fish_tales/fishUtils.ts`
- **Theme & styles**
  - `client/src/assets/styles/_theme.scss` with Bootstrap variable overrides
  - `style.scss` updates:
    - Responsive images & emoji alignment
    - Form error styling
    - `.input-group-text` hover styles
- **Docker**
  - `compose.yaml → docker/docker-compose.yml`
  - Created production placeholder `docker/docker-compose.prod.yml`
  - `Dockerfile → docker/Dockerfile` with SQLite support
- **Example & static assets**
  - Moved into `client` directory:
    - `public/example_files/fishTales_starter_file.xlsx`
    - `public/images/tb_icon.ico`
    - `src/assets/images/*`
- **Constants**
  - Consolidated `apps/base/constants/_shopScraper.js`, `_messages.js`, `_prompts.js`, `_scrapers.js`, `index.ts` into `apps/base/constants.ts`
- **Configuration files**
  - Moved into `config` directory:
    - `.stylelintrc`, `.eslint.config.js`, `global.d.ts`, `tsconfig.app.json`, `tsconfig.node.json`, `tsconfig.json`, `vite.config.json`
- **Setup & scripts**
  - Updated `docs/setup.md` packages
  - Added/updated `Justfile` commands for setup, docker, DB, formatting, linting, and running
  - Moved `server.ts` to `server/` and configured for React (removed WebSockets)
  - Moved error routes to `server/api/error.ts` and API routes to `server/api/index.ts`
  - Setup script can be rerun without overriding API keys

####  Removed

- **Old Docker & ignore rules**
  - Old Dockerfile
  - `.dockerignore` rules for `node_modules/`, `media/`, `.env`
- **Legacy base utilities**
  - `apps/base/_dateUtils.js`
- **Deprecated routes, sockets, and static files**
  - `docs/deprecated/routes/*`
  - `docs/deprecated/sockets/*`
  - `docs/deprecated/static/js/*`
  - `docs/deprecated/views/*`
- **Documentation**
  - `docs/config.md`
  - `docs/ide.md` Auto-Compile SCSS section & screenshot (`docs/images/scss_screenshot.png`)

### [v3.7](https://github.com/zanemyers/RescueRiver/compare/v3.6..v3.7) — _4 Sep 2025_

#### **Added**

- Option in FishTales to generate a `site_list.txt` for refining starter files.
- `.env` setup now includes placeholders for SERP and Gemini API keys.

#### **Changed**

- [Justfile](../justfile) updated to install dependencies locally and support flexible `start` commands.
- Renamed `REPORT_DIVIDER` constant to `DIVIDER` and updated FishTales logic accordingly.
- Upgraded Node base image from `23.11-slim` → `24.7.0-slim` in the [Dockerfile](../Dockerfile).
- Reordered FishTales form advanced input fields.
- Updated documentation for FishTales starter file workflow.
- Updated dependencies: `@google/genai`, `bootstrap`, `chrono-node`, `playwright`, `serpapi`, `eslint`, `stylelint`, and others.
- Refined [IDE](./ide.md) and [setup](./setup.md) documentation for both Docker and local workflows.

#### **Removed**

- Redundant or outdated Docker/Local instructions in IDE documentation.

### [v3.6](https://github.com/zanemyers/RescueRiver/compare/v3.5..v3.6) — _3 Sep 2025_

#### **Changed**

- Fixed docs tab layout to reference renamed partials (`*_doc.ejs` instead of `*_documentation.ejs`) for ShopReel, FishTales, and SiteScout.

### [v3.5](https://github.com/zanemyers/RescueRiver/compare/v3.4..v3.5) — _3 Sep 2025_

#### **Changed**

- Renamed the **CLI & Environment** section to **Environment** in [`docs/setup.md`](./setup.md).
- Simplified `.env` generation logic in `setup.ts`.

#### **Removed**

- Deleted unused dependencies from [`package.json`](../package.json) and `package-lock.json`.
- Removed outdated packages from [`docs/setup.md`](./setup.md).

### [v3.4](https://github.com/zanemyers/RescueRiver/compare/v3.3..v3.4) — _3 Sep 2025_

#### **Added**

- Added new images for documentation for FishTales, ShopReel, and SiteScout.
- Added `.docs` layout for sidebar and content area to [SCSS](../client/src/assets/styles/style.scss).
- Added documentation pages in [`views/apps/docs/`](deprecated/views/apps/docs):
  - [`docs.ejs`](deprecated/views/apps/docs.ejs) — tabbed layout for ShopReel, FishTales, and SiteScout documentation.
  - [`fish_tales_doc.ejs`](deprecated/views/apps/docs/fish_tales_doc.ejs) — FishTales Documentation.
  - [`shop_reel_doc.ejs`](deprecated/views/apps/docs/shop_reel_doc.ejs) — ShopReel Documentation.
  - [`site_scout_doc.ejs`](deprecated/views/apps/docs/site_scout_doc.ejs) — SiteScout Documentation.

#### **Changed**

- Renamed `report_starter_file_ex.xlsx` → [`fishTales_starter_file.xlsx`](../client/public/example_files/fishTales_starter_file.xlsx).
- Renamed `routes/_partials.js` → [`routes/_forms.js`](../server/api/_forms.js).
- Moved [`idea.jpg`](../client/src/assets/images/about/idea.jpg), [`important.jpg`](../client/src/assets/images/about/important.jpg), [`serve.jpg`](../client/src/assets/images/about/serve.jpg) to [`about/`](../client/src/assets/images/about).
- Updated CSS/SCSS to improve readability.
- Simplified text in instructions panel and updated links to point to documentation.
- **Moved files:**
  - Form partials to [`views/apps/forms/`](deprecated/views/apps/forms):
    - [`fish_tales_form.ejs`](deprecated/views/apps/forms/fish_tales_form.ejs)
    - [`shop_reel_form.ejs`](deprecated/views/apps/forms/shop_reel_form.ejs)
    - [`site_scout_form.ejs`](deprecated/views/apps/forms/site_scout_form.ejs)
  - Main tool views to [`views/apps/`](deprecated/views/apps):
    - [`fish_tales.ejs`](deprecated/views/apps/fish_tales.ejs)
    - [`shop_reel.ejs`](deprecated/views/apps/shop_reel.ejs)
    - [`site_scout.ejs`](deprecated/views/apps/site_scout.ejs)
- Updated Express routes to reflect new file locations.

### [v3.3](https://github.com/zanemyers/RescueRiver/compare/v3.2..v3.3) — _25 Aug 2025_

#### **Added**

- **SiteScout**:
  - WebSocket ([`/ws/site-scout`](../server/server.ts)) with [`siteScoutSocket`](deprecated/sockets/_siteScoutSocket.js) for handling `shopReel` + `fishTales` files.
  - Frontend: [`siteScoutFormApp.js`](deprecated/static/js/siteScoutFormApp.js), [`site_scout_form.ejs`](deprecated/views/apps/forms/site_scout_form.ejs) partial, and [`site_scout.ejs`](deprecated/views/apps/site_scout.ejs) page.

#### **Changed**

- **Sockets**: `reportSocket` → [`fishTalesSocket`](deprecated/sockets/_fishTalesSocket.js), `shopSocket` → [`shopReelSocket`](deprecated/sockets/_shopReelSocket.js).
- **Routes**: `/shop-form` → [`/shop-reel-form`](../server/api/_apps.js), `/report-form` → [`/fish-tales-form`](../server/api/_apps.js).
- **Server**: WebSocket routes moved to [`/ws/shop-reel`](../server/server.ts), [`/ws/fish-tales`](../server/server.ts).
- [**BaseFormApp**](deprecated/static/js/baseFormApp.js): WebSocket port fixed at `3000` (was `process.env.PORT`).
- **SiteScout logic**: [`mergeMissingUrls`](../server/apps/site_scout/siteScout.ts) now accepts in-memory buffers, supports cancellation, returns updated starter files.
- [**File input**](deprecated/static/js/fileInput.js): refactored for independent components (`.file-input-component`), simplified partials, and per-component init.
- **Forms**: `reportFormApp.js` → [`fishTalesFormApp.js`](deprecated/static/js/fishTalesFormApp.js), `shopFormApp.js` → [`shopReelFormApp.js`](deprecated/static/js/shopReelFormApp.js).
- [**SCSS**](../client/src/assets/styles/style.scss): restructured styles for `.file-input-component` (better drag-drop + file display).
- [**Map UI**](deprecated/static/js/map.js): switched lat/lng handling to `input[name="latitude"]` / `input[name="longitude"]`.
- **Views**:
  - Updated wording in [`fish_tales.ejs`](deprecated/views/apps/fish_tales.ejs) + [`shop_reel.ejs`](deprecated/views/apps/shop_reel.ejs) (fly-fishing focus, privacy notices).
  - [`index.ejs`](deprecated/views/index.ejs) SiteScout button text: _Coming Soon_ → _Check your sites_.
  - [`header.ejs`](deprecated/views/partials/header.ejs) menu renamed to **SiteScout**.
- **Docs**: refreshed [`README.md`](../README.md), [`setup.md`](./setup.md), and [`config.md`](./config.md).

#### **Removed**

- Legacy `rr_logo.png`.
- Old socket files `_reportSocket.js`, `_shopSocket.js`.
- Redundant IDs in `file_input.ejs` (class-based now).

### [v3.2](https://github.com/zanemyers/RescueRiver/compare/v3.1..v3.2) — _21 Aug 2025_

#### **Added**

- New [**App**](deprecated/views/index.ejs) page with hero section and cards for **ShopReel**, **FishTales**, **SiteScout**, and **Docs**.
- New [**About**](deprecated/views/about.ejs) page with supporting images:
  - `static/images/idea.jpg`
  - `static/images/important.jpg`
  - `static/images/serve.jpg`
- Reusable [**Card partial**](deprecated/views/partials/card.ejs) supporting slim and normal layouts.
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
- [**Compose**](../docker/docker-compose.yml):
  - service `fly-box` → `flybox`
  - added `PORT` env var
  - switched port mapping to `"${PORT}:3000"`
- [**BaseFormApp**](deprecated/static/js/baseFormApp.js): WebSocket URL now uses `process.env.PORT` instead of hardcoded `3000`.
- [**Header**](deprecated/views/partials/header.ejs): updated with larger logo, “Flybox” branding, and a “More” dropdown.
- [**Footer**](deprecated/views/partials/footer.ejs): simplified styling.
- [**Layout**](deprecated/views/layouts/base.ejs): favicon updated from `fishing_pole.ico` to `tackle_box.png`.

#### **Removed**

- Legacy favicon `static/images/fishing_pole.ico`.

### [v3.1](https://github.com/zanemyers/RescueRiver/compare/v3.0..v3.1) — _19 Aug 2025_

#### **Added**

- Conditional API key handling in scrapers for development (`process.env.GEMINI_API_KEY`).
- Live Sass Compiler auto-compilation setup in VS Code.
- Compound debugger configuration combining local and Docker.

#### **Changed**

- Updated asset paths in EJS templates and `server.ts` to use `/static`.
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
- `server.ts` for Express web server with internal WebSocket support
- Expanded routes (`_apps.js`, `_index.js`, `_forms.js`, `_test.js`, `error.ts`)
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
