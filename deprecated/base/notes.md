# 🗒️ Deprecation Notes – base (v2.0)

## 🧾 Summary

The `base` module included general-purpose utilities and constants. In **v2.0**, the following were deprecated:

- `CSVFileWriter` and `CSVFileReader` classes
- Enum-based configuration constants

## ❌ Why These Were Deprecated

- **CSVFileWriter / CSVFileReader**: Replaced by the more powerful `ExcelFileHandler`, which supports native Excel output with formatting and richer structure using the `ExcelJS` library.
- **Enums and Configuration Constants**: The switch to SerpAPI and environment-based configuration made many of these redundant. Removing them simplified the config layer.

### 🗑️ Deprecated Constants

These specific constants were removed:

- `PHONE_REGEX`
- `STARS_REGEX`
- `REVIEW_COUNT_REGEX`
- `SOCIAL_MEDIA`

## 🔄 Replacement

- Use `ExcelFileHandler` for reading and writing structured spreadsheet data.

## 🕓 Status

These items were **fully removed in v2.0** and should not be referenced in new code. All usage should be migrated to supported replacements.
