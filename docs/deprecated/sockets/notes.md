# 🗒️ Deprecation Notes – Flybox ([UNRELEASED])

## 🧾 Summary

All `WebSockets` have been deprecated.

### ❌ Reason for Deprecation

The WebSocket implementation was removed because switching to API endpoints simplifies the architecture.  
Using API endpoints allows for database-backed state management instead of handling everything in memory, making the system easier to reason about and maintain.

### 🔄 Replacement

Use the new API endpoints instead of WebSockets for all real-time or state-related operations.

## 🕓 Status

WebSocket support has been fully removed from the codebase. All new interactions should use the API endpoints.
