## 📋 Setup

### ⚙️ Visual Studio Code Settings

#### 🐞 Debugging

- On MacOS press `cmd + shift + p` to open the command palette
- Search `Debug: Toggle Auto Attach` and set it to `Only With Flag`

#### 🧰 Recommended Extensions

- Container Tools by Microsoft
- Docker by Microsoft
- Docker DX by Docker
- Excel Viewer by MESCIUS
- GitHub Copilot by GitHub
- Github Copilot Chat by Github
- Prettier - Code formatter by Prettier

### 🐳 Docker

- Install [Docker Desktop](https://docs.docker.com/get-started/get-docker/)
- Run `docker-compose build` in the terminal

### 🏠 Local

- Install [Node.js](https://nodejs.org/en/download) (recommend using LTS)
- Run `npm install` in the terminal

### 🌳 Environment

- Run `just setup_env` in the terminal to create your `.env` file
  - Follow the prompts
  - You can re-run the command or edit the file manually anytime

### 📦 Packages

- **Parsing & Dates:** [Chrono-Node](https://www.npmjs.com/package/chrono-node), [Date-FNS](https://www.npmjs.com/package/date-fns)
- **CLI & Environment:** [Dotenv](https://www.npmjs.com/package/dotenv), [Enquirer](https://www.npmjs.com/package/enquirer), [Ora](https://www.npmjs.com/package/ora)
- **Scraping:** [Playwright](https://www.npmjs.com/package/playwright)
- **Excel Handling:** [ExcelJS](https://www.npmjs.com/package/exceljs)
- **AI Integration:** [@google/genai](https://www.npmjs.com/package/@google/genai)
- **Async Control:** [@supercharge/promise-pool](https://www.npmjs.com/package/@supercharge/promise-pool)
- **Search API:** [SerpAPI](https://www.npmjs.com/package/serpapi)
