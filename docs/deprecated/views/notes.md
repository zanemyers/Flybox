# 🗒️ Deprecation Notes – Flybox ([UNRELEASED])

## 🧾 Summary

All **EJS view templates** have been **deprecated** in favor of a React-based frontend.

### ❌ Why This Was Deprecated

- The `views/` directory previously contained server-rendered EJS templates, including:
  - **apps/** – app-specific pages (e.g., `fish_tales`, `shop_reel`, `site_scout`, `docs`).
  - **layouts/** – layout wrappers for shared structure.
  - **partials/** – reusable components (e.g., `progress`).
  - **about.ejs**, **error.ejs**, **index.ejs** – top-level site pages.
- With the transition to **React**, client-side rendering and routing fully replaced the EJS templating system.
- This makes Express responsible **only for backend APIs**, not for UI rendering.

### 🔄 Replacement

- All UI is now built in **React components** with **React Router** handling navigation.
- Layouts and partials are replaced by **shared React components**.
- Error and About pages are now React routes, e.g.:
  - `/about` → `<AboutPage />`
  - `/error` → `<ErrorBoundary />`
  - `/` → `<HomePage />`

## 🕓 Status

- The `views/` directory remains in the repo for legacy reference.
- New development should exclusively use **React components** for frontend rendering.
