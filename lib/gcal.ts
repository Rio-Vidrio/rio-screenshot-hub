/**
 * Google Calendar deep-link helpers.
 * All times are local — no timezone conversion, Rio is in Phoenix (MST, no DST).
 */

function getCalendarEmail(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("calendarEmail") || "";
}

function appendAuthUser(url: string): string {
  const email = getCalendarEmail();
  if (!email) return url;
  return `${url}&authuser=${encodeURIComponent(email)}`;
}

function toGCalDate(dateStr: string, timeStr: string): string {
  const [year, month, day] = dateStr.split("-");
  const [hour, minute] = timeStr.split(":");
  return `${year}${month}${day}T${hour}${minute}00`;
}

export function buildCalendarEventLink({
  title,
  date,
  startTime,
  endTime,
  details = "",
  location = "",
}: {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  details?: string;
  location?: string;
}): string {
  const start = toGCalDate(date, startTime);
  const end = toGCalDate(date, endTime);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${start}/${end}`,
    details,
    location,
  });
  return appendAuthUser(`https://calendar.google.com/calendar/render?${params.toString()}`);
}

export function buildReminderLink({
  title,
  details = "",
}: {
  title: string;
  details?: string;
}): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const start = `${year}${month}${day}T200000`;
  const end = `${year}${month}${day}T203000`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${start}/${end}`,
    details,
  });
  return appendAuthUser(`https://calendar.google.com/calendar/render?${params.toString()}`);
}

export function buildTaskLink({ title, details = "" }: { title: string; details?: string }): string {
  return buildReminderLink({ title: `[Task] ${title}`, details });
}
