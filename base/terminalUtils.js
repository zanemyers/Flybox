/**
 * Utility functions for terminal output like progress bars and spinners.
 *
 * This module includes:
 * - `progressBar(current, total, barWidth)`: Displays a progress bar in the terminal.
 * - `startSpinner(text)`: Starts a spinner animation in the terminal.
 * - `stopSpinner(spinner, doneText)`: Stops the spinner and prints a completion message.
 */

const spinnerFrames = ["-", "\\", "|", "/"];

/**
 * Displays a progress bar in the terminal.
 *
 * @param {number} current - The current progress value.
 * @param {number} total - The total value representing 100% completion.
 * @param {number} [barWidth=30] - The width of the progress bar in characters.
 */
function progressBar(current, total, barWidth = 30) {
  const percent = current / total;
  const filled = Math.round(percent * barWidth);
  const empty = barWidth - filled;
  const bar = "█".repeat(filled) + "░".repeat(empty);

  let text = `${current}/${total}`;
  if (current === total) {
    text = "Finished!\n";
  }

  process.stdout.write(`\r[${bar}] ${text}`);
}

/**
 * Starts a terminal spinner animation with the provided text.
 *
 * @param {string} text - The text to display next to the spinner.
 * @returns {NodeJS.Timeout} - A timer reference that can be passed to `stopSpinner`.
 */
function startSpinner(text) {
  let i = 0;
  return setInterval(() => {
    process.stdout.write(
      `\r${spinnerFrames[i++ % spinnerFrames.length]} ${text}`
    );
  }, 100);
}

/**
 * Stops the terminal spinner and prints a completion message.
 *
 * @param {NodeJS.Timeout} spinner - The spinner timer returned by `startSpinner`.
 * @param {string} doneText - The text to display when the spinner is stopped.
 */
function stopSpinner(spinner, doneText) {
  clearInterval(spinner);
  process.stdout.write(`\r${doneText}      \n`);
}

module.exports = {
  progressBar,
  startSpinner,
  stopSpinner,
};
