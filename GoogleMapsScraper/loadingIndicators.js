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

const spinnerFrames = ["-", "\\", "|", "/"];
function startSpinner(text) {
  let i = 0;
  return setInterval(() => {
    process.stdout.write(
      `\r${spinnerFrames[i++ % spinnerFrames.length]} ${text}`
    );
  }, 100);
}

function stopSpinner(spinner, doneText) {
  clearInterval(spinner);
  process.stdout.write(`\r${doneText}      \n`);
}

module.exports = {
  progressBar,
  startSpinner,
  stopSpinner,
};
