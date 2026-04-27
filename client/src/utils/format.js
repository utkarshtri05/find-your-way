export const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));

export const formatDateTime = (value) => {
  if (!value) {
    return "Never";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

export const formatRelativeTime = (value) => {
  if (!value) {
    return "No activity yet";
  }

  const date = new Date(value).getTime();
  const diffInMinutes = Math.round((date - Date.now()) / 60000);
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (Math.abs(diffInMinutes) < 60) {
    return formatter.format(diffInMinutes, "minute");
  }

  const diffInHours = Math.round(diffInMinutes / 60);

  if (Math.abs(diffInHours) < 24) {
    return formatter.format(diffInHours, "hour");
  }

  return formatter.format(Math.round(diffInHours / 24), "day");
};

export const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

