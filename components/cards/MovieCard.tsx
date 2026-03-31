"use client";

import { MovieData } from "@/lib/types";
import { buildReminderLink } from "@/lib/gcal";

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

function ActionBtn({ href, children }: { href: string; children: React.ReactNode }) {
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

export default function MovieCard({ data }: { data: MovieData }) {
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(`${data.title} ${data.year} where to watch`)}`;
  const reminderLink = buildReminderLink({ title: `Watch — ${data.title}` });

  return (
    <div className="card-reveal">
      {/* Synopsis */}
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
        {data.synopsis}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px 24px",
          marginBottom: "20px",
        }}
      >
        <Field label="Title" value={data.title} />
        <Field label="Year" value={data.year} />
        <Field label="Genre" value={data.genre} />
        <Field label="Rating" value={data.rating} />
        <div>
          <div style={LABEL_STYLE}>Platform</div>
          {data.platform ? (
            <span
              style={{
                background: "#f0a500",
                color: "#0e0e0e",
                fontSize: "11px",
                fontWeight: 600,
                padding: "2px 8px",
                borderRadius: "3px",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {data.platform}
            </span>
          ) : (
            <div style={VALUE_STYLE}>—</div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <ActionBtn href={searchUrl}>Find where to watch</ActionBtn>
        <ActionBtn href={reminderLink}>Remind me at 8PM</ActionBtn>
      </div>
    </div>
  );
}
