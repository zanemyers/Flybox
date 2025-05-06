function getUTCYearMonth(date) {
  const year = String(date.getUTCFullYear());
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return [year, month];
}

function getUTCTimeStamp(date) {
  const year = String(date.getUTCFullYear());
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}_T${hours}-${minutes}-${seconds}Z`;
}

module.exports = {
  getUTCTimeStamp,
  getUTCYearMonth,
};
