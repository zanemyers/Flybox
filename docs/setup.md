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

- Run `just setup` in the terminal to create your `.env` file, install dependencies & initialize the database.
  - You can edit the `.env` manually anytime to change the default values.

### 🏃‍♂️ Running

- 🐳 **Docker**: Run `just start` in the terminal (build happens automatically on first run).
- 🏠 **Local**: Run `just start -l` in the terminal.

### 📦 Packages

This project uses a variety of packages for scraping, browser automation, AI summarization, Excel handling, React frontend, and concurrency control.

- **Parsing & Dates**
    - [Chrono-Node](https://www.npmjs.com/package/chrono-node) – Natural language date parser for extracting dates from text.
    - [Date-FNS](https://www.npmjs.com/package/date-fns) – Modern JavaScript date utility library for formatting, comparisons, and calculations.

- **Environment**
    - [Dotenv](https://www.npmjs.com/package/dotenv) – Loads environment variables from a `.env` file.

- **Scraping & Browser Automation**
    - [Playwright](https://www.npmjs.com/package/playwright) – Browser automation library for headless and headed browsing.
    - [Playwright-Extra](https://www.npmjs.com/package/playwright-extra) – Extensible version of Playwright to use plugins.
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

- **Database & File Uploads**
    - [@prisma/client](https://www.npmjs.com/package/@prisma/client) – Type-safe database client for Node.js and TypeScript.
    - [Multer](https://www.npmjs.com/package/multer) – Middleware for handling multipart/form-data, primarily used for file uploads in Express.

- **Styling & Frontend**
    - [Bootstrap](https://www.npmjs.com/package/bootstrap) – CSS framework used for form styling and layout.
    - [React](https://www.npmjs.com/package/react) – Library for building user interfaces.
    - [React-DOM](https://www.npmjs.com/package/react-dom) – Provides DOM-specific methods for React.
    - [React-Bootstrap](https://www.npmjs.com/package/react-bootstrap) – React components for Bootstrap.
    - [React-Router-DOM](https://www.npmjs.com/package/react-router-dom) – Routing library for React single-page applications.
    - [React-Leaflet](https://www.npmjs.com/package/react-leaflet) – React wrapper for Leaflet maps.
    - [Leaflet](https://www.npmjs.com/package/leaflet) – Core mapping library used by React-Leaflet.
    - [React-Markdown](https://www.npmjs.com/package/react-markdown) – Render Markdown content as React components.

- **Server & Templates**
    - [Express](https://www.npmjs.com/package/express) – Fast, minimal Node.js web framework.

