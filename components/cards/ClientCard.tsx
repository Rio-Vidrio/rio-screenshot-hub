"use client";

import { ClientConvoData } from "@/lib/types";
import { buildCalendarEventLink } from "@/lib/gcal";
import { useState } from "react";

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
          fontFamily: "'DM Sans', sans-serif",
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
          fontFamily: "'JetBrains Mono', monospace",
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
  children,
  primary,
}: {
  href?: string;
  children: React.ReactNode;
  primary?: boolean;
}) {
  const base = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: "44px",
    padding: "0 16px",
    borderRadius: "6px",
    fontSize: "13px",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    cursor: "pointer",
    textDecoration: "none",
    transition: "background 150ms",
    border: primary ? "none" : "1px solid #D4CEC8",
    background: primary ? "#1A1714" : "#FFFFFF",
    color: primary ? "#FFFFFF" : "#1A1714",
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="action-btn"
      style={base}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.background = primary ? "#2C2825" : "#F5F2EE";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.background = primary ? "#1A1714" : "#FFFFFF";
      }}
    >
      <span>{children}</span>
      <span>→</span>
    </a>
  );
}

export default function ClientCard({ data }: { data: ClientConvoData }) {
  const [notifyClient, setNotifyClient] = useState(false);

  const calLink = buildCalendarEventLink({
    title: `${data.meetingType} — ${data.clientName}`,
    date: data.date,
    startTime: data.startTime,
    endTime: data.endTime,
    details: data.notes,
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
            fontFamily: "'DM Sans', sans-serif",
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
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
            fontSize: "12px",
            color: "#6B6560",
          }}
        >
          Notify client
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <ActionBtn href={calLink} primary>Add to Google Calendar</ActionBtn>
        {smsLink && <ActionBtn href={smsLink}>Send SMS to {data.phone}</ActionBtn>}
        {emailLink && <ActionBtn href={emailLink}>Email {data.email}</ActionBtn>}
      </div>
    </div>
  );
}
