"use client";

import { MovieData } from "@/lib/types";
import { useState, useEffect } from "react";
import {
  buildReminderLink,
  getDefaultCalendarEmail,
  isIOS,
  buildReminderICSContent,
  triggerICSDownload,
} from "@/lib/gcal";

function Field({ label, value, index, children }: { label: string; value?: string; index: number; children?: React.ReactNode }) {
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
      {children || (
        <div
          style={{
            fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
            fontSize: "12px",
            color: "#1A1714",
          }}
        >
          {value || "—"}
        </div>
      )}
    </div>
  );
}

function ActionBtn({ href, onClick, children, primary }: { href?: string; onClick?: () => void; children: React.ReactNode; primary?: boolean }) {
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
        <span>{children}</span><span>→</span>
      </button>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="action-btn" style={baseStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <span>{children}</span><span>→</span>
    </a>
  );
}

export default function MovieCard({ data }: { data: MovieData }) {
  const [ios, setIos] = useState(false);
  useEffect(() => { setIos(isIOS()); }, []);

  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(`${data.title} ${data.year} where to watch`)}`;
  const reminderLink = buildReminderLink({
    title: `Watch — ${data.title}`,
    calendarEmail: getDefaultCalendarEmail(),
  });

  return (
    <div>
      {data.synopsis && (
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
          {data.synopsis}
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
        <Field label="Title" value={data.title} index={0} />
        <Field label="Year" value={data.year} index={1} />
        <Field label="Genre" value={data.genre} index={2} />
        <Field label="Rating" value={data.rating} index={3} />
        <Field label="Platform" index={4}>
          {data.platform ? (
            <span
              style={{
                display: "inline-block",
                background: "#C8A882",
                color: "#FFFFFF",
                fontSize: "10px",
                fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
                fontWeight: 500,
                padding: "2px 8px",
                borderRadius: "3px",
                marginTop: "1px",
              }}
            >
              {data.platform}
            </span>
          ) : (
            <span style={{ fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)", fontSize: "12px", color: "#1A1714" }}>—</span>
          )}
        </Field>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <ActionBtn href={searchUrl} primary>Find where to watch</ActionBtn>
        {ios ? (
          <ActionBtn onClick={() => {
            const ics = buildReminderICSContent({ title: `Watch — ${data.title}` });
            triggerICSDownload(ics, "movie-reminder.ics");
          }}>Remind me at 8PM</ActionBtn>
        ) : (
          <ActionBtn href={reminderLink}>Remind me at 8PM</ActionBtn>
        )}
      </div>
    </div>
  );
}
