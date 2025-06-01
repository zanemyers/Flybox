## 📋 Setup

### ⚙️ Visual Studio Code Settings

#### 🐞 Debugging

- On MacOS press `cmd + shift + p` to open the command palette
- Search `Debug: Toggle Auto Attach` and set it to `Only With Flag`

#### 🧰 Recommended Extensions

- CSV by ReprEng
- Docker by Microsoft
- Docker DX by Docker
- GitHub Copilot by GitHub
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

- **Parsing & Dates:** Chrono-Node, Date-FNS
- **CLI & Environment:** Enquirer, Dotenv
- **Scraping:** Playwright
- **CSV Handling:** Fast-CSV
- **AI Integration:** Google/Genai
