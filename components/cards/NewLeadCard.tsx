"use client";

import { NewLead } from "@/lib/types";
import { useState, useEffect } from "react";
import {
  buildCalendarEventLink,
  getCalendarPrefs,
  CalendarPrefs,
  isIOS,
  isAppleDevice,
  buildICSContent,
  triggerICSDownload,
} from "@/lib/gcal";
import ActionDivider from "@/components/ActionDivider";
import ReminderButton from "@/components/ReminderButton";

// Treat "Unknown" or empty as blank so Field shows "—"
function norm(v: string): string {
  return !v || v.toLowerCase() === "unknown" ? "" : v;
}

function Field({ label, value, index }: { label: string; value: string; index: number }) {
  return (
    <div className="field-cell" style={{ background: "#F5F2EE", padding: "10px", borderRadius: "6px", animationDelay: `${index * 40}ms` }}>
      <div style={{ fontFamily: "var(--font-dm, 'DM Sans', sans-serif)", fontWeight: 500, fontSize: "10px", color: "#A39E99", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "3px" }}>
        {label}
      </div>
      <div style={{ fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)", fontSize: "12px", color: "#1A1714" }}>
        {value || "—"}
      </div>
    </div>
  );
}

function ActionBtn({ href, onClick, children, primary }: { href?: string; onClick?: () => void; children: React.ReactNode; primary?: boolean }) {
  const base = { display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", height: "44px", padding: "0 16px", borderRadius: "6px", fontSize: "13px", fontFamily: "var(--font-dm, 'DM Sans', sans-serif)", fontWeight: 500, cursor: "pointer", textDecoration: "none", transition: "background 150ms", border: primary ? "none" : "1px solid #D4CEC8", background: primary ? "#1A1714" : "#FFFFFF", color: primary ? "#FFFFFF" : "#1A1714" };
  const onEnter = (e: React.MouseEvent<HTMLElement>) => ((e.currentTarget as HTMLElement).style.background = primary ? "#2C2825" : "#F5F2EE");
  const onLeave = (e: React.MouseEvent<HTMLElement>) => ((e.currentTarget as HTMLElement).style.background = primary ? "#1A1714" : "#FFFFFF");
  if (onClick) return <button onClick={onClick} className="action-btn" style={base} onMouseEnter={onEnter} onMouseLeave={onLeave}><span>{children}</span><span>→</span></button>;
  return <a href={href} target="_blank" rel="noopener noreferrer" className="action-btn" style={base} onMouseEnter={onEnter} onMouseLeave={onLeave}><span>{children}</span><span>→</span></a>;
}

const REMINDER_OPTIONS = [
  { label: "15 min before", value: 15 },
  { label: "30 min before", value: 30 },
  { label: "1 hour before", value: 60 },
  { label: "2 hours before", value: 120 },
  { label: "1 day before", value: 1440 },
];

interface NewLeadCardProps {
  data: NewLead;
  onOpenCalendarSetup?: () => void;
}

export default function NewLeadCard({ data, onOpenCalendarSetup }: NewLeadCardProps) {
  const [copied, setCopied] = useState(false);
  const [calPrefs, setCalPrefs] = useState<CalendarPrefs | null>(null);
  const [selectedCalIndex, setSelectedCalIndex] = useState(0);
  const [ios, setIos] = useState(false);
  const [apple, setApple] = useState(false);
  const [reminderOpen, setReminderOpen] = useState(false);
  const [reminderMinutes, setReminderMinutes] = useState(30);

  useEffect(() => {
    const prefs = getCalendarPrefs();
    setCalPrefs(prefs);
    setSelectedCalIndex(prefs?.defaultIndex ?? 0);
    setIos(isIOS());
    setApple(isAppleDevice());
  }, []);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowISO = tomorrow.toLocaleDateString("en-CA", { timeZone: "America/Phoenix" });

  const selectedEmail = calPrefs?.calendars[selectedCalIndex]?.email ?? undefined;
  const eventTitle = `Intro call — ${data.name}`;
  const eventDetails = [norm(data.intent), norm(data.timeline), norm(data.priceRange)].filter(Boolean).join(" · ") + (data.notes ? `\n${data.notes}` : "");

  const introCallLink = buildCalendarEventLink({
    title: eventTitle,
    date: tomorrowISO,
    startTime: "10:00",
    endTime: "10:30",
    details: eventDetails,
    calendarEmail: selectedEmail,
  });

  const reminderCalLink = buildCalendarEventLink({
    title: eventTitle,
    date: tomorrowISO,
    startTime: "10:00",
    endTime: "10:30",
    details: eventDetails,
    calendarEmail: selectedEmail,
    reminderMinutes,
  });

  const appleReminderUrl = `x-apple-reminderkit://REMCDReminder?title=${encodeURIComponent(eventTitle)}&notes=${encodeURIComponent(data.notes || "")}&dueDate=${tomorrowISO}T10:00:00`;

  const smsLink = data.phone ? `sms:${data.phone.replace(/\D/g, "")}` : null;
  const emailLink = data.email ? `mailto:${data.email}` : null;

  const fields = [
    { label: "Name", value: data.name },
    { label: "Phone", value: data.phone },
    { label: "Email", value: data.email },
    { label: "Intent", value: norm(data.intent) },
    { label: "Timeline", value: norm(data.timeline) },
    { label: "Price Range", value: norm(data.priceRange) },
  ];

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "20px" }}>
        {fields.map((f, i) => <Field key={f.label} label={f.label} value={f.value} index={i} />)}
      </div>

      {data.notes && (
        <div style={{ background: "#F5F2EE", borderRadius: "6px", padding: "14px", marginBottom: "20px", fontFamily: "var(--font-dm, 'DM Sans', sans-serif)", fontWeight: 300, fontSize: "13px", color: "#6B6560", lineHeight: "1.7" }}>
          {data.notes}
        </div>
      )}

      {data.followUpTemplate && (
        <div style={{ borderLeft: "3px solid #C8A882", paddingLeft: "14px", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
            <span style={{ fontFamily: "var(--font-dm, 'DM Sans', sans-serif)", fontWeight: 500, fontSize: "10px", color: "#C8A882", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Follow-up text ready
            </span>
            <button
              onClick={() => { navigator.clipboard.writeText(data.followUpTemplate); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
              style={{ background: "transparent", border: "none", fontSize: "11px", color: copied ? "#4A7C59" : "#C8A882", fontFamily: "var(--font-dm, 'DM Sans', sans-serif)", cursor: "pointer", padding: "0" }}
            >
              {copied ? "Copied ✓" : "Copy"}
            </button>
          </div>
          <div style={{ fontFamily: "var(--font-dm, 'DM Sans', sans-serif)", fontWeight: 300, fontSize: "13px", color: "#1A1714", lineHeight: "1.7" }}>
            {data.followUpTemplate}
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {smsLink && <ActionBtn href={smsLink} primary>Text {data.name}</ActionBtn>}
        {emailLink && <ActionBtn href={emailLink}>Email {data.name}</ActionBtn>}

        <ActionDivider label="schedule a call" />

        {/* Calendar picker row */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontFamily: "var(--font-dm, 'DM Sans', sans-serif)", fontWeight: 300, fontSize: "12px", color: "#A39E99", flexShrink: 0 }}>Add to</span>
          {calPrefs && calPrefs.calendars.length > 0 ? (
            <select
              value={selectedCalIndex}
              onChange={(e) => setSelectedCalIndex(Number(e.target.value))}
              style={{ flex: 1, padding: "6px 10px", border: "1px solid #D4CEC8", borderRadius: "6px", fontSize: "12px", fontFamily: "var(--font-dm, 'DM Sans', sans-serif)", color: "#1A1714", background: "#FAFAF9", cursor: "pointer", outline: "none" }}
            >
              {calPrefs.calendars.map((cal, i) => <option key={i} value={i}>{cal.label || cal.email}</option>)}
            </select>
          ) : (
            <button onClick={onOpenCalendarSetup} style={{ background: "transparent", border: "none", color: "#C8A882", fontSize: "12px", fontFamily: "var(--font-dm, 'DM Sans', sans-serif)", cursor: "pointer", padding: 0 }}>
              Set up calendar →
            </button>
          )}
        </div>

        {ios ? (
          <ActionBtn onClick={() => {
            const ics = buildICSContent({ title: eventTitle, date: tomorrowISO, startTime: "10:00", endTime: "10:30", details: eventDetails });
            triggerICSDownload(ics, `intro-call-${data.name.replace(/\s+/g, "-")}.ics`);
          }}>
            Add intro call to Calendar
          </ActionBtn>
        ) : (
          <ActionBtn href={introCallLink}>Add intro call to calendar</ActionBtn>
        )}

        {/* Reminder options toggle */}
        <button
          onClick={() => setReminderOpen((v) => !v)}
          style={{ background: "transparent", border: "none", padding: "2px 0", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", alignSelf: "flex-start" }}
        >
          <span style={{ fontFamily: "var(--font-dm, 'DM Sans', sans-serif)", fontWeight: 300, fontSize: "11px", color: "#A39E99" }}>
            Reminder options
          </span>
          <span style={{ fontSize: "9px", color: "#A39E99", display: "inline-block", transform: reminderOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 150ms" }}>▼</span>
        </button>

        {reminderOpen && (
          <div style={{ background: "#F5F2EE", borderRadius: "8px", overflow: "hidden", animation: "fadeIn 0.15s ease", marginTop: "-2px", display: "grid", gridTemplateColumns: "1fr 1fr" }}>
            {/* Column A — Google Calendar */}
            <div style={{ padding: "14px", borderRight: "1px solid #E8E4DF" }}>
              <div style={{ fontFamily: "var(--font-dm, 'DM Sans', sans-serif)", fontWeight: 500, fontSize: "12px", color: "#1A1714", marginBottom: "10px" }}>
                Google Calendar
              </div>
              {calPrefs && calPrefs.calendars.length > 0 && (
                <select
                  value={selectedCalIndex}
                  onChange={(e) => setSelectedCalIndex(Number(e.target.value))}
                  style={{ width: "100%", padding: "6px 8px", border: "1px solid #D4CEC8", borderRadius: "6px", fontSize: "11px", fontFamily: "var(--font-dm, 'DM Sans', sans-serif)", color: "#1A1714", background: "#FFFFFF", marginBottom: "8px", outline: "none" }}
                >
                  {calPrefs.calendars.map((cal, i) => <option key={i} value={i}>{cal.label || cal.email}</option>)}
                </select>
              )}
              <select
                value={reminderMinutes}
                onChange={(e) => setReminderMinutes(Number(e.target.value))}
                style={{ width: "100%", padding: "6px 8px", border: "1px solid #D4CEC8", borderRadius: "6px", fontSize: "11px", fontFamily: "var(--font-dm, 'DM Sans', sans-serif)", color: "#1A1714", background: "#FFFFFF", marginBottom: "10px", outline: "none" }}
              >
                {REMINDER_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <a
                href={reminderCalLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "34px", background: "#1A1714", color: "#FAFAF9", borderRadius: "6px", fontSize: "12px", fontFamily: "var(--font-dm, 'DM Sans', sans-serif)", fontWeight: 500, textDecoration: "none" }}
              >
                Set reminder →
              </a>
            </div>

            {/* Column B — Apple Reminders */}
            <div style={{ padding: "14px" }}>
              <div style={{ fontFamily: "var(--font-dm, 'DM Sans', sans-serif)", fontWeight: 500, fontSize: "12px", color: "#1A1714", marginBottom: "10px" }}>
                Apple Reminders
              </div>
              {apple ? (
                <a
                  href={appleReminderUrl}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "34px", border: "1px solid #D4CEC8", borderRadius: "6px", background: "#FFFFFF", fontSize: "12px", fontFamily: "var(--font-dm, 'DM Sans', sans-serif)", fontWeight: 500, color: "#1A1714", textDecoration: "none" }}
                >
                  Add to Reminders →
                </a>
              ) : (
                <div style={{ fontSize: "11px", color: "#A39E99", fontFamily: "var(--font-dm, 'DM Sans', sans-serif)", fontWeight: 300, lineHeight: "1.6" }}>
                  Apple Reminders is only available on iPhone and Mac
                </div>
              )}
            </div>
          </div>
        )}

        <ActionDivider label="or set a reminder" />
        <ReminderButton
          title={`Follow up — ${data.name}`}
          description={[norm(data.intent), norm(data.timeline), norm(data.priceRange)].filter(Boolean).join(" · ") + (data.notes ? `\n${data.notes}` : "")}
        />
      </div>
    </div>
  );
}
