"use client";

import { ClientConvoData } from "@/lib/types";
import { buildCalendarEventLink } from "@/lib/gcal";
import { useState } from "react";

const FIELD_STYLE = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "12px 24px",
};

const LABEL_STYLE = {
  color: "#666",
  fontSize: "11px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.08em",
  marginBottom: "2px",
};

const VALUE_STYLE = {
  fontFamily: "'JetBrains Mono', monospace",
  color: "#e8e8e8",
  fontSize: "13px",
};

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={LABEL_STYLE}>{label}</div>
      <div style={VALUE_STYLE}>{value || "—"}</div>
    </div>
  );
}

function ActionBtn({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "block",
        width: "100%",
        padding: "10px 16px",
        background: "transparent",
        border: "1px solid #2a2a2a",
        borderRadius: "4px",
        color: "#e8e8e8",
        fontSize: "13px",
        textDecoration: "none",
        textAlign: "left",
        cursor: "pointer",
        transition: "border-color 150ms",
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLAnchorElement).style.borderColor = "#f0a500")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLAnchorElement).style.borderColor = "#2a2a2a")
      }
    >
      {children} →
    </a>
  );
}

export default function ClientCard({ data }: { data: ClientConvoData }) {
  const [notifyClient, setNotifyClient] = useState(false);

  const eventTitle = `${data.meetingType} — ${data.clientName}`;
  const calLink = buildCalendarEventLink({
    title: eventTitle,
    date: data.date,
    startTime: data.startTime,
    endTime: data.endTime,
    details: data.notes,
  });

  const smsLink = data.phone
    ? `sms:${data.phone.replace(/\D/g, "")}`
    : null;
  const emailLink = data.email ? `mailto:${data.email}` : null;

  return (
    <div className="card-reveal">
      {/* Notes */}
      {data.notes && (
        <div
          style={{
            background: "#1a1a1a",
            border: "1px solid #2a2a2a",
            borderRadius: "6px",
            padding: "12px 14px",
            marginBottom: "20px",
            fontSize: "13px",
            color: "#aaa",
            lineHeight: "1.6",
          }}
        >
          {data.notes}
        </div>
      )}

      {/* Fields */}
      <div style={FIELD_STYLE}>
        <Field label="Client" value={data.clientName} />
        <Field label="Meeting Type" value={data.meetingType} />
        <Field label="Date" value={data.date} />
        <Field label="Time" value={`${data.startTime} – ${data.endTime}`} />
        <Field label="Phone" value={data.phone} />
        <Field label="Email" value={data.email} />
      </div>

      {/* Notify toggle */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginTop: "20px",
          marginBottom: "16px",
        }}
      >
        <button
          onClick={() => setNotifyClient((v) => !v)}
          style={{
            width: "36px",
            height: "20px",
            borderRadius: "10px",
            background: notifyClient ? "#f0a500" : "#2a2a2a",
            border: "none",
            cursor: "pointer",
            position: "relative",
            transition: "background 150ms",
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
              background: "#e8e8e8",
              transition: "left 150ms",
            }}
          />
        </button>
        <span style={{ fontSize: "12px", color: "#666" }}>Notify client</span>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <ActionBtn href={calLink}>Add to Google Calendar</ActionBtn>
        {smsLink && <ActionBtn href={smsLink}>Send SMS to {data.phone}</ActionBtn>}
        {emailLink && <ActionBtn href={emailLink}>Email {data.email}</ActionBtn>}
      </div>
    </div>
  );
}
