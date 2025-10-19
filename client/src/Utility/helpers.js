// For Timestamp

const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
function getTimeDifference(pastTime) {
  const currentTime = new Date(); // current time
  const diffMs = currentTime - new Date(pastTime); // in milliseconds
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return formatter.format(-diffSeconds, "second");
  if (diffMinutes < 60) return formatter.format(-diffMinutes, "minute");
  if (diffHours < 24) return formatter.format(-diffHours, "hour");
  return formatter.format(-diffDays, "day");
}

export default getTimeDifference;