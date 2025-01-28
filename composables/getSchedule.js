export default function getSchedule(date) {
  // Check if the environment is development
  if (process.env.NODE_ENV === "development") {
    return 2; // Always return 1 in development mode
  }

  // Normal logic for calculating schedule
  const localDate = new Date(date ?? null);
  const hour = localDate.getHours();
  const minute = localDate.getMinutes();

  let period = 0;

  if (hour === 16 && minute >= 50) {
    period = 1;
  }
  if (hour === 17 || hour === 18) {
    period = 1;
  }
  if (hour === 19 && minute < 50) {
    period = 1;
  }
  if (hour === 19 && minute >= 50) {
    period = 2;
  }
  if (hour === 20 || hour === 21) {
    period = 2;
  }
  if (hour === 22 && minute < 50) {
    period = 2;
  }

  return period;
}
