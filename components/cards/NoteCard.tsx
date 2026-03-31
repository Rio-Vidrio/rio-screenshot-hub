"use client";

import { NoteData } from "@/lib/types";
import { buildTaskLink } from "@/lib/gcal";

function ActionBtn({
  href,
  children,
  onClick,
}: {
  href?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const shared = {
    display: "block",
    width: "100%",
    padding: "10px 16px",
    background: "transparent",
    border: "1px solid #2a2a2a",
    borderRadius: "4px",
    color: "#e8e8e8",
    fontSize: "13px",
    textDecoration: "none",
    textAlign: "left" as const,
    cursor: "pointer",
    transition: "border-color 150ms",
    fontFamily: "'Inter', sans-serif",
  };

  if (onClick) {
    return (
      <button
        onClick={onClick}
        style={shared}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.borderColor = "#f0a500")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.borderColor = "#2a2a2a")
        }
      >
        {children} →
      </button>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={shared}
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

export default function NoteCard({ data }: { data: NoteData }) {
  const taskLink = buildTaskLink({ title: data.title, details: data.content });

  return (
    <div className="card-reveal">
      {/* Category + actionable */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <span
          style={{
            background: "#222",
            border: "1px solid #333",
            color: "#aaa",
            fontSize: "11px",
            padding: "3px 8px",
            borderRadius: "3px",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {data.category}
        </span>
        {data.actionable && (
          <span
            style={{
              background: "#1a2a0a",
              border: "1px solid #2a4a0a",
              color: "#6aba2a",
              fontSize: "11px",
              padding: "3px 8px",
              borderRadius: "3px",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            ACTIONABLE
          </span>
        )}
      </div>

      {/* Content */}
      <div
        style={{
          background: "#1a1a1a",
          border: "1px solid #2a2a2a",
          borderRadius: "6px",
          padding: "14px",
          fontSize: "13px",
          color: "#ccc",
          lineHeight: "1.7",
          marginBottom: "20px",
          whiteSpace: "pre-wrap",
        }}
      >
        {data.content}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <ActionBtn onClick={() => navigator.clipboard.writeText(data.content)}>
          Copy note
        </ActionBtn>
        {data.actionable && (
          <ActionBtn href={taskLink}>Add to calendar as task</ActionBtn>
        )}
      </div>
    </div>
  );
}
