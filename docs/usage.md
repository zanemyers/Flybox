## 🚀 Usage

All run/debug commands use [`just`](https://just.systems/man/en/) task runner.

### 🏃 Run Commands

| Tool           | Docker    | Local                       |
| -------------- | --------- | --------------------------- |
| Shop Scraper   | `just ss` | `just ss -l` or `node main` |
| Report Scraper | `just rs` | `just rs -l` or `node main` |

> For local runs with `node main`, first navigate into the app directory.

### 🐞 Debugging Locally

| Tool           | Debug Command                            |
| -------------- | ---------------------------------------- |
| Shop Scraper   | `just ss -l -d` or `node --inspect main` |
| Report Scraper | `just rs -l -d` or `node --inspect main` |

> Docker-based debugging is currently **not available**.
