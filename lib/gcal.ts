/**
 * Google Calendar deep-link helpers.
 * All times are local — no timezone conversion, Rio is in Phoenix (MST, no DST).
 */

export interface CalendarPrefs {
  calendars: { label: string; email: string }[];
  defaultIndex: number;
}

export function getCalendarPrefs(): CalendarPrefs | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("calendarPrefs");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getDefaultCalendarEmail(): string {
  const prefs = getCalendarPrefs();
  if (!prefs || !prefs.calendars.length) return "";
  return prefs.calendars[prefs.defaultIndex]?.email || prefs.calendars[0].email;
}

function toGCalDate(dateStr: string, timeStr: string): string {
  const [year, month, day] = dateStr.split("-");
  const [hour, minute] = timeStr.split(":");
  return `${year}${month}${day}T${hour}${minute}00`;
}

function appendAuthUser(url: string, _calendarEmail?: string): string {
  // Always use authuser=0 (current primary Google session).
  // Passing an email address causes Google to demand sign-in for that account
  // if it isn't the active session, triggering an unwanted sign-up flow.
  return `${url}&authuser=0`;
}

export function buildCalendarEventLink({
  title,
  date,
  startTime,
  endTime,
  details = "",
  location = "",
  calendarEmail,
}: {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  details?: string;
  location?: string;
  calendarEmail?: string;
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
  return appendAuthUser(
    `https://calendar.google.com/calendar/render?${params.toString()}`,
    calendarEmail
  );
}

export function buildReminderLink({
  title,
  details = "",
  calendarEmail,
}: {
  title: string;
  details?: string;
  calendarEmail?: string;
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
  return appendAuthUser(
    `https://calendar.google.com/calendar/render?${params.toString()}`,
    calendarEmail
  );
}

export function buildTaskLink({
  title,
  details = "",
  calendarEmail,
}: {
  title: string;
  details?: string;
  calendarEmail?: string;
}): string {
  return buildReminderLink({ title: `[Task] ${title}`, details, calendarEmail });
}
