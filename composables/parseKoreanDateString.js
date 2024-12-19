export default function parseKoreanDateString(dateString) {
  // Extract the year, month, and day using a regular expression
  const match = dateString.match(/(\d{4})년 (\d{1,2})월 (\d{1,2})일/);

  if (match) {
    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1; // Months are zero-based in JavaScript
    const day = parseInt(match[3], 10);

    // Create and return the Date object
    return new Date(year, month, day);
  } else {
    throw new Error("Invalid Korean date string format.");
  }
}
