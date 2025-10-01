# 🗒️ Deprecation Notes – Flybox Views ([UNRELEASED])

## 🧾 Summary

All static JavaScript files previously associated with EJS views have been deprecated.

### ❌ Why This Was Deprecated

- Previously, each EJS view (`index.ejs`, `about.ejs`, `error.ejs`, etc.) relied on separate static JS files to handle client-side interactions and dynamic behavior.
- With the migration to **React**, all view logic and interactivity are now encapsulated in React components.
- Separate static JS files are no longer necessary, as React handles state, events, and DOM updates internally.

### 🔄 Replacement

- All UI logic has been moved into React components.
- Inline event handling, state management, and effects are now handled with React hooks and component lifecycle methods.
- There is no longer a need to reference external JS files in the rendered HTML templates.

## 🕓 Status

- Legacy static JS files remain in the repository for reference but should not be used in new development.
- New code should use React components for all frontend behavior and interactivity.
