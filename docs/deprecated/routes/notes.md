# 🗒️ Deprecation Notes – Flybox ([UNRELEASED])

## 🧾 Summary

The **Express-based route files** ([`_index.js`](_index.js), [`_apps.js`](_apps.js), [`_forms.js`](_forms.js), [`_test.js`](_test.js), [`index.ts`](index.js)) have been **deprecated**.

### ❌ Why This Was Deprecated

- These routes previously rendered **server-side EJS templates** for pages (`fishTales`, `shopReel`, `siteScout`, `docs`, `about`) and partials (`forms`, `progress`).
- With the transition to a **React frontend**, the rendering logic was moved to the client side.
- Express no longer serves EJS templates, so these routes are no longer needed.

### 🔄 Replacement

- **React** now handles:
  - Page rendering and routing (via React Router).
  - Component-based UI for forms, progress indicators, and app views.
- Express remains in use only as an **API backend** for data fetching and processing.

## 🕓 Status

- These route files remain in the repository for reference during the migration.
- New code should use **React components** for UI rendering and **API routes** for backend logic.
