export default function getSchedule(date) {
  // if from 4:50pm to 7:50pm -> 1st period, 8:10pm to 9:50pm -> 2nd period
  const localDate = new Date(data ?? null);
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
