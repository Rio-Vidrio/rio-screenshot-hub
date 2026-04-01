"use client";

import { ClientConvoData } from "@/lib/types";
import {
  buildCalendarEventLink,
  getCalendarPrefs,
  CalendarPrefs,
  isIOS,
  buildICSContent,
  triggerICSDownload,
} from "@/lib/gcal";
import ActionDivider from "@/components/ActionDivider";
import ReminderButton from "@/components/ReminderButton";
import { useState, useEffect } from "react";

interface ClientCardProps {
  data: ClientConvoData;
  onOpenCalendarSetup?: () => void;
}

function Field({ label, value, index }: { label: string; value: string; index: number }) {
  return (
    <div
      className="field-cell"
      style={{
        background: "#F5F2EE",
        padding: "10px",
        borderRadius: "6px",
        animationDelay: `${index * 40}ms`,
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
          fontWeight: 500,
          fontSize: "10px",
          color: "#A39E99",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: "3px",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
          fontSize: "12px",
          color: "#1A1714",
        }}
      >
        {value || "—"}
      </div>
    </div>
  );
}

function ActionBtn({
  href,
  onClick,
  children,
  primary,
}: {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  primary?: boolean;
}) {
  const baseStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: "44px",
    padding: "0 16px",
    borderRadius: "6px",
    fontSize: "13px",
    fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
    fontWeight: 500,
    cursor: "pointer",
    textDecoration: "none",
    transition: "background 150ms",
    border: primary ? "none" : "1px solid #D4CEC8",
    background: primary ? "#1A1714" : "#FFFFFF",
    color: primary ? "#FFFFFF" : "#1A1714",
  };
  const onEnter = (e: React.MouseEvent<HTMLElement>) =>
    ((e.currentTarget as HTMLElement).style.background = primary ? "#2C2825" : "#F5F2EE");
  const onLeave = (e: React.MouseEvent<HTMLElement>) =>
    ((e.currentTarget as HTMLElement).style.background = primary ? "#1A1714" : "#FFFFFF");

  if (onClick) {
    return (
      <button onClick={onClick} className="action-btn" style={baseStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>
        <span>{children}</span>
        <span>→</span>
      </button>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="action-btn" style={baseStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <span>{children}</span>
      <span>→</span>
    </a>
  );
}

export default function ClientCard({ data, onOpenCalendarSetup }: ClientCardProps) {
  const [notifyClient, setNotifyClient] = useState(false);
  const [calPrefs, setCalPrefs] = useState<CalendarPrefs | null>(null);
  const [selectedCalIndex, setSelectedCalIndex] = useState(0);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    const prefs = getCalendarPrefs();
    setCalPrefs(prefs);
    setSelectedCalIndex(prefs?.defaultIndex ?? 0);
    setIos(isIOS());
  }, []);

  const selectedEmail = calPrefs?.calendars[selectedCalIndex]?.email ?? undefined;

  const calLink = buildCalendarEventLink({
    title: `${data.meetingType} — ${data.clientName}`,
    date: data.date,
    startTime: data.startTime,
    endTime: data.endTime,
    details: data.notes,
    calendarEmail: selectedEmail,
  });

  const smsLink = data.phone ? `sms:${data.phone.replace(/\D/g, "")}` : null;
  const emailLink = data.email ? `mailto:${data.email}` : null;

  const fields = [
    { label: "Client", value: data.clientName },
    { label: "Meeting Type", value: data.meetingType },
    { label: "Date", value: data.date },
    { label: "Time", value: `${data.startTime} – ${data.endTime}` },
    { label: "Phone", value: data.phone },
    { label: "Email", value: data.email },
  ];

  return (
    <div>
      {data.notes && (
        <div
          style={{
            background: "#F5F2EE",
            borderRadius: "6px",
            padding: "14px",
            marginBottom: "20px",
            fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
            fontWeight: 300,
            fontSize: "13px",
            color: "#6B6560",
            lineHeight: "1.7",
          }}
        >
          {data.notes}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px",
          marginBottom: "20px",
        }}
      >
        {fields.map((f, i) => (
          <Field key={f.label} label={f.label} value={f.value} index={i} />
        ))}
      </div>

      {/* Notify toggle */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "16px",
        }}
      >
        <button
          onClick={() => setNotifyClient((v) => !v)}
          style={{
            width: "36px",
            height: "20px",
            borderRadius: "10px",
            background: notifyClient ? "#C8A882" : "#E8E4DF",
            border: "none",
            cursor: "pointer",
            position: "relative",
            transition: "background 150ms",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              position: "absolute",
              top: "2px",
              left: notifyClient ? "18px" : "2px",
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              background: "#FFFFFF",
              transition: "left 150ms",
              boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
            }}
          />
        </button>
        <span
          style={{
            fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
            fontWeight: 400,
            fontSize: "12px",
            color: "#6B6560",
          }}
        >
          Notify client
        </span>
      </div>

      {/* Calendar picker row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "8px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
            fontWeight: 300,
            fontSize: "12px",
            color: "#A39E99",
            flexShrink: 0,
          }}
        >
          Add to
        </span>
        {calPrefs && calPrefs.calendars.length > 0 ? (
          <select
            value={selectedCalIndex}
            onChange={(e) => setSelectedCalIndex(Number(e.target.value))}
            style={{
              flex: 1,
              padding: "6px 10px",
              border: "1px solid #D4CEC8",
              borderRadius: "6px",
              fontSize: "12px",
              fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
              color: "#1A1714",
              background: "#FAFAF9",
              cursor: "pointer",
              outline: "none",
            }}
          >
            {calPrefs.calendars.map((cal, i) => (
              <option key={i} value={i}>
                {cal.label || cal.email}
              </option>
            ))}
          </select>
        ) : (
          <button
            onClick={onOpenCalendarSetup}
            style={{
              background: "transparent",
              border: "none",
              color: "#C8A882",
              fontSize: "12px",
              fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
              cursor: "pointer",
              padding: 0,
            }}
          >
            Set up calendar →
          </button>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {ios ? (
          <ActionBtn
            onClick={() => {
              const ics = buildICSContent({
                title: `${data.meetingType} — ${data.clientName}`,
                date: data.date,
                startTime: data.startTime,
                endTime: data.endTime,
                details: data.notes,
              });
              triggerICSDownload(ics, `${data.clientName.replace(/\s+/g, "-")}.ics`);
            }}
            primary
          >
            Add to Calendar
          </ActionBtn>
        ) : (
          <ActionBtn href={calLink} primary>Add to Google Calendar</ActionBtn>
        )}
        {smsLink && <ActionBtn href={smsLink}>Send SMS to {data.phone}</ActionBtn>}
        {emailLink && <ActionBtn href={emailLink}>Email {data.email}</ActionBtn>}
        <ActionDivider label="or set a reminder" />
        <ReminderButton
          title={`Follow up — ${data.clientName}`}
          description={`${data.meetingType} · ${data.notes}`}
        />
      </div>
    </div>
  );
}
