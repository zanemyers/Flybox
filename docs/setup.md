## 📋 Setup

### 🔧 Tooling

> Download and Install the following

- [Just](https://just.systems/man/en/)
- [Docker Desktop](https://docs.docker.com/get-started/get-docker/)
- [Node.js](https://nodejs.org/en/download) (LTS recommended)

### 🛠️ IDE Setup

You can use any editor, but setup instructions are included for two popular IDEs:

- [WebStorm](ide.md#-webstorm-setup)
- [Visual Studio Code](ide.md#-visual-studio-code-setup)

### 🌳 Environment

- Run `just setup` in the terminal to create your `.env` file
  - Follow the prompts
  - You can edit the file manually anytime to change variables

### 🧱 Building

- 🐳 **Docker**: Run `docker-compose build` in the terminal
- 🏠 **Local**: Run `npm install` in the terminal

### 🏃‍♂️ Running

- 🐳 **Docker**: Run `docker-compose up` in the terminal
- 🏠 **Local**: Run `just start` in the terminal

### 📦 Packages

This project uses a variety of packages for scraping, browser automation, AI summarization, Excel handling, CLI prompts, and concurrency control.

- **Parsing & Dates**
  - [Chrono-Node](https://www.npmjs.com/package/chrono-node) – Natural language date parser for extracting dates from text.
  - [Date-FNS](https://www.npmjs.com/package/date-fns) – Modern JavaScript date utility library for formatting, comparisons, and calculations.

- **Environment**
  - [Dotenv](https://www.npmjs.com/package/dotenv) – Loads environment variables from a `.env` file.

- **Scraping & Browser Automation**
  - [Playwright](https://www.npmjs.com/package/playwright) – Browser automation library for headless and headed browsing.
  - [Playwright-Extra](https://www.npmjs.com/package/playwright-extra) – Extensible version of Playwright to use plugins, e.g., stealth plugins.
  - [Puppeteer-Extra-Plugin-Stealth](https://www.npmjs.com/package/puppeteer-extra-plugin-stealth) – Helps evade bot detection for automated browsers.

- **Excel Handling**
  - [ExcelJS](https://www.npmjs.com/package/exceljs) – Read and write Excel (`.xlsx`) spreadsheets entirely in Node.js.

- **AI Integration**
  - [@google/genai](https://www.npmjs.com/package/@google/genai) – SDK for Google Gemini / Generative AI models, used for summarizing reports.

- **Async Control**
  - [@supercharge/promise-pool](https://www.npmjs.com/package/@supercharge/promise-pool) – Manage concurrent async tasks with controlled concurrency.
  - [TinyQueue](https://www.npmjs.com/package/tinyqueue) – Fast priority queue for JavaScript, used for ordered processing of tasks.

- **Search & Data Fetching**
  - [SerpAPI](https://www.npmjs.com/package/serpapi) – API for scraping Google search results, including Google Maps business listings.

- **Styling & Frontend**
  - [Bootstrap](https://www.npmjs.com/package/bootstrap) – CSS framework used for form styling and layout.

- **Server & Templates**
  - [Express](https://www.npmjs.com/package/express) – Fast, minimal Node.js web framework.
  - [Express-EJS-Layouts](https://www.npmjs.com/package/express-ejs-layouts) – Layout support for EJS templates in Express.
  - [EJS](https://www.npmjs.com/package/ejs) – Embedded JavaScript templates for generating HTML.

- **WebSockets**
  - [WS](https://www.npmjs.com/package/ws) – Simple and fast WebSocket library for Node.js.
