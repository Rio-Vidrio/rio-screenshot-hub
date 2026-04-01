"use client";

import { NoteData } from "@/lib/types";
import { buildTaskLink } from "@/lib/gcal";

function ActionBtn({
  href,
  children,
  primary,
  onClick,
}: {
  href?: string;
  children: React.ReactNode;
  primary?: boolean;
  onClick?: () => void;
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
    fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
    fontWeight: 500,
    cursor: "pointer",
    textDecoration: "none",
    transition: "background 150ms",
    border: primary ? "none" : "1px solid #D4CEC8",
    background: primary ? "#1A1714" : "#FFFFFF",
    color: primary ? "#FFFFFF" : "#1A1714",
  };

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="action-btn"
        style={base}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.background = primary ? "#2C2825" : "#F5F2EE")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.background = primary ? "#1A1714" : "#FFFFFF")
        }
      >
        <span>{children}</span>
        <span>→</span>
      </button>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="action-btn"
      style={base}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLAnchorElement).style.background = primary ? "#2C2825" : "#F5F2EE")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLAnchorElement).style.background = primary ? "#1A1714" : "#FFFFFF")
      }
    >
      <span>{children}</span>
      <span>→</span>
    </a>
  );
}

export default function NoteCard({ data }: { data: NoteData }) {
  const taskLink = buildTaskLink({ title: data.title, details: data.content });

  return (
    <div>
      {/* Tags */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            background: "#F5F2EE",
            border: "1px solid #E8E4DF",
            color: "#6B6560",
            fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
            fontWeight: 500,
            fontSize: "11px",
            padding: "3px 10px",
            borderRadius: "4px",
          }}
        >
          {data.category}
        </span>
        {data.actionable && (
          <span
            style={{
              background: "#EDF5F0",
              border: "1px solid #C8DDD1",
              color: "#4A7C59",
              fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
              fontWeight: 500,
              fontSize: "11px",
              padding: "3px 10px",
              borderRadius: "4px",
            }}
          >
            Actionable
          </span>
        )}
      </div>

      {/* Content */}
      <div
        style={{
          background: "#F5F2EE",
          borderRadius: "6px",
          padding: "14px",
          marginBottom: "20px",
          fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
          fontWeight: 300,
          fontSize: "13px",
          color: "#1A1714",
          lineHeight: "1.7",
          whiteSpace: "pre-wrap",
        }}
      >
        {data.content}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <ActionBtn onClick={() => navigator.clipboard.writeText(data.content)} primary>
          Copy note
        </ActionBtn>
        {data.actionable && (
          <ActionBtn href={taskLink}>Add to calendar as task</ActionBtn>
        )}
      </div>
    </div>
  );
}
