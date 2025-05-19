export default function dateToString(date: Date) {
  if (!date) return new Date().toISOString();
  return date.toISOString();
}