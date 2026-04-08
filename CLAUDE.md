# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All common tasks are in the `justfile` — run with `just <command>`:

```bash
just setup              # Initial setup: copy .env + npm install
just start              # Start via Docker Compose (recommended)
just start -l           # Start local Node.js server (no Docker)
just start -d           # Debug mode: nodemon + --inspect

just build_frontend     # Vite build only
just lint               # ESLint + Stylelint with auto-fix
just format             # Prettier format

just migrate NAME=""    # Create/apply Prisma migration
just pull_db            # Sync schema from database (prisma db pull)
just generate_db        # Regenerate Prisma client
just reset_db           # Reset database completely
just studio_db          # Launch Prisma Studio GUI
just cleanup_db         # Run database cleanup script
```

There are no automated tests.

Vite proxies `/api` → `http://localhost:3000`, so in local dev run the Express server (`just start -l`) and Vite dev server separately.

## Architecture

**Flybox** is a full-stack scraping/summarization tool built for Rescue River. It has three tools: ShopReel (find fishing shops via Google Maps + scrape their sites), FishTales (parse and AI-summarize fishing reports), and SiteScout (diff ShopReel results against FishTales config).

### Request lifecycle

1. React form submits multipart data to `POST /api/<tool>`
2. Express route (via Multer for file uploads) calls the tool's API class, which creates a `Job` record in Postgres and kicks off async processing
3. Client polls `GET /api/<tool>/:id/updates` for `JobMessage` rows (progress/emoji logs) and final status
4. On completion, the same updates endpoint returns file buffers; client triggers download

### Key structural patterns

- **`apps/base/_baseAPI.js`** — abstract Express controller; subclasses implement `createJob()` and `getFiles()`. Handles the three standard endpoints (create, updates/cancel) automatically.
- **`apps/base/_baseApp.js`** — abstract job runner; subclasses implement business logic. Provides `addMessage()`, `cancel()`, and periodic cancellation polling against the DB.
- Each tool (`fish_tales/`, `shop_reel/`, `site_scout/`) has an `*API.js` (extends BaseAPI) and an `*App.js` (extends BaseApp).

### Database

Prisma + Neon serverless PostgreSQL. Two models:

- **`Job`** — tracks a single scraping run: `type` (SHOP_REEL | FISH_TALES | SITE_SCOUT), `status` (IN_PROGRESS | COMPLETED | CANCELLED | FAILED), `primaryFile`/`secondaryFile` (binary result blobs).
- **`JobMessage`** — append-only progress log attached to a Job (cascading delete).

Schema lives at `server/db/schema.prisma`. The Prisma client is a singleton in `server/db.js`.

### Frontend

React 19 + React Router 7 + Bootstrap 5. Config: `config/vite.config.ts`. Path aliases: `@images`, `@components`, `@styles` (all relative to `client/src/`). Each tool has a form component (`client/src/components/forms/`) that handles file upload, job creation, polling, and result download.

### Environment variables

Copy `.env.example` to `.env`. Key vars:

```
DATABASE_URL        # Neon pooled connection string
DIRECT_URL          # Neon direct connection (used by Prisma CLI)
SERP_API_KEY        # Google Maps search (ShopReel)
GEMINI_API_KEY      # AI summarization (FishTales)
RUN_HEADLESS        # true in Docker, false for local debugging
CONCURRENCY         # Playwright concurrency (default 5)
```

### Linting config

ESLint config at `config/eslint.config.js` uses separate rule sets for plain JS (server/scripts) vs TypeScript+React (client). Prettier config: double quotes, semicolons, 2-space indent. Stylelint covers SCSS in `client/`.
