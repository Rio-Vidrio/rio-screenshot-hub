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

// ─── iOS / native calendar helpers ───────────────────────────────────────────

/** True when running on iPhone or iPad. */
export function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

/** Build a raw iCalendar (.ics) string for a timed event. */
export function buildICSContent({
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
  const uid = `${Date.now()}@rio-screenshot-hub`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Rio Screenshot Hub//EN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${title}`,
  ];
  if (details) lines.push(`DESCRIPTION:${details.replace(/\n/g, "\\n")}`);
  if (location) lines.push(`LOCATION:${location}`);
  lines.push("END:VEVENT", "END:VCALENDAR");
  return lines.join("\r\n");
}

/** Build a .ics reminder for today at 8 PM (same shape as buildReminderLink). */
export function buildReminderICSContent({
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
  return buildICSContent({
    title,
    date: `${year}-${month}-${day}`,
    startTime: "20:00",
    endTime: "20:30",
    details,
  });
}

/**
 * Build a Google Calendar render URL for a custom date + time reminder.
 * Used by ReminderButton. End time = start + 30 minutes.
 */
export function buildReminderUrl(
  title: string,
  description: string,
  _calendarEmail: string,
  date: string, // YYYY-MM-DD
  time: string, // HH:MM
): string {
  const [yr, mo, dy] = date.split("-");
  const [hr, mn] = time.split(":");
  const startStr = `${yr}${mo}${dy}T${hr}${mn}00`;
  const startMs = new Date(
    parseInt(yr), parseInt(mo) - 1, parseInt(dy), parseInt(hr), parseInt(mn)
  ).getTime();
  const end = new Date(startMs + 30 * 60 * 1000);
  const endStr = `${end.getFullYear()}${String(end.getMonth() + 1).padStart(2, "0")}${String(end.getDate()).padStart(2, "0")}T${String(end.getHours()).padStart(2, "0")}${String(end.getMinutes()).padStart(2, "0")}00`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${startStr}/${endStr}`,
    details: description,
  });
  return appendAuthUser(`https://calendar.google.com/calendar/render?${params.toString()}`);
}

/** Trigger a .ics blob download — iOS Safari hands it off to Apple Calendar. */
export function triggerICSDownload(content: string, filename = "event.ics"): void {
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
