export default function getTime(n) {
  if (n == 1) {
    const startDate = new Date();
    const endDate = new Date();

    // Set the start time to 6:00 PM
    startDate.setHours(18, 0, 0, 0); // 6:00 PM

    // Set the end time to 7:50 PM
    endDate.setHours(19, 50, 0, 0); // 7:50 PM

    return [startDate, endDate];
  }

  if (n == 2) {
    const startDate = new Date();
    const endDate = new Date();

    // Set the start time to 8:10 PM
    startDate.setHours(20, 10, 0, 0); // 8:10 PM

    // Set the end time to 9:50 PM
    endDate.setHours(21, 50, 0, 0); // 9:50 PM

    return [startDate, endDate];
  }
}
