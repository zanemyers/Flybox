import { DATE_REGEX_PATTERNS, MONTHS } from "../base/enums.js";

/**
 * Utility functions for handling UTC date formatting.
 *
 * This module includes:
 * - `getUTCTimeStamp(date)`: Converts a Date object to a formatted UTC timestamp string.
 * - `getUTCYearMonth(date)`: Extracts the UTC year and month from a Date object.
 */

/**
 * Extracts the UTC year and month from a given Date object.
 *
 * @param {Date} date - The date from which to extract year and month.
 * @returns {[string, string]} - An array containing the year and zero-padded month as strings (e.g., ['2025', '05']).
 */
function getUTCYearMonth(date) {
  const year = String(date.getUTCFullYear());
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return [year, month];
}

/**
 * Generates a UTC timestamp string from a given Date object.
 *
 * @param {Date} date - The date to convert into a timestamp.
 * @returns {string} - A formatted UTC timestamp string (e.g., '2025-05-07_T13-45-30Z').
 */
function getUTCTimeStamp(date) {
  const year = String(date.getUTCFullYear());
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}_T${hours}-${minutes}-${seconds}Z`;
}

/**
 * Parses a date from a given text string by matching multiple common date formats.

 * The function uses regex patterns to detect date strings, extracts year, month, and day,
 * converts month names to month indices, validates date components, and returns a Date object.
 * It avoids locale-dependent Date parsing by manually constructing the Date.
 *
 * @param {string} text - Input text possibly containing a date.
 * @returns {Date|null} A valid Date object if a date is found and valid; otherwise, null.
 */
function getDateFromText(text) {
  for (const regex of DATE_REGEX_PATTERNS) {
    const match = text.match(regex);
    if (match) {
      let year, month, day;

      switch (regex) {
        // 1. "May 25, 2020" or "May 25th, 2020"
        case DATE_REGEX_PATTERNS[0]: {
          // match: [full, monthName, day, year]
          month = MONTHS[match[1].toLowerCase()];
          day = parseInt(match[2], 10);
          year = parseInt(match[3], 10);
          break;
        }

        // 2. "25 May 2020" or "25th May 2020"
        case DATE_REGEX_PATTERNS[1]: {
          // match: [full, day, monthName, year]
          day = parseInt(match[1], 10);
          month = MONTHS[match[2].toLowerCase()];
          year = parseInt(match[3], 10);
          break;
        }

        // 3. ISO "2020-05-25"
        case DATE_REGEX_PATTERNS[2]: {
          year = parseInt(match[1], 10);
          month = parseInt(match[2], 10) - 1; // months 0-indexed
          day = parseInt(match[3], 10);
          break;
        }

        // 4. US style "05/25/2020" (MM/DD/YYYY)
        case DATE_REGEX_PATTERNS[3]: {
          month = parseInt(match[1], 10) - 1;
          day = parseInt(match[2], 10);
          year = parseInt(match[3], 10);
          break;
        }

        // 5. US style with dashes MM-DD-YYYY
        case DATE_REGEX_PATTERNS[4]: {
          month = parseInt(match[1], 10) - 1;
          day = parseInt(match[2], 10);
          year = parseInt(match[3], 10);
          break;
        }

        // 6. "25-May-2020"
        case DATE_REGEX_PATTERNS[5]: {
          day = parseInt(match[1], 10);
          month = MONTHS[match[2].toLowerCase()];
          year = parseInt(match[3], 10);
          break;
        }

        // 7. "Tue, May 25, 2020"
        case DATE_REGEX_PATTERNS[6]: {
          month = MONTHS[match[1].toLowerCase()];
          day = parseInt(match[2], 10);
          year = parseInt(match[3], 10);
          break;
        }

        // 8. "Jan, 2, 2020"
        case DATE_REGEX_PATTERNS[7]: {
          month = MONTHS[match[1].toLowerCase()];
          day = parseInt(match[2], 10);
          year = parseInt(match[3], 10);
          break;
        }

        default:
          continue; // unknown pattern, try next
      }

      // Validate parsed values
      if (
        typeof year === "number" &&
        year > 0 &&
        typeof month === "number" &&
        month >= 0 &&
        month <= 11 &&
        typeof day === "number" &&
        day >= 1 &&
        day <= 31
      ) {
        const date = new Date(year, month, day);

        // Extra check: ensure date components match (to avoid JS auto-correct e.g. Feb 30 -> Mar 2)
        if (
          date.getFullYear() === year &&
          date.getMonth() === month &&
          date.getDate() === day
        ) {
          return date;
        }
      }
    }
  }
  return null;
}

export { getDateFromText, getUTCTimeStamp, getUTCYearMonth };
