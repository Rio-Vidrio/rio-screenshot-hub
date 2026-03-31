"use client";

import { SessionItem, AnalysisResult } from "@/lib/types";

const TYPE_COLORS: Record<string, string> = {
  CLIENT_CONVO: "#f0a500",
  RESTAURANT: "#22c55e",
  MOVIE: "#eab308",
  SOCIAL_CONTENT: "#9ca3af",
  MARKET_STATS: "#ef4444",
  NOTE: "#d1d5db",
};

function getItemName(result: AnalysisResult): string {
  switch (result.type) {
    case "CLIENT_CONVO":
      return result.clientName || "Client";
    case "RESTAURANT":
      return result.name;
    case "MOVIE":
      return result.title;
    case "SOCIAL_CONTENT":
      return result.platform + " — " + result.contentType;
    case "MARKET_STATS":
      return result.headline.slice(0, 40) + (result.headline.length > 40 ? "…" : "");
    case "NOTE":
      return result.title;
  }
}

function relativeTime(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

interface SessionPanelProps {
  items: SessionItem[];
  activeId: string | null;
  onSelect: (item: SessionItem) => void;
  onClear: () => void;
}

export default function SessionPanel({
  items,
  activeId,
  onSelect,
  onClear,
}: SessionPanelProps) {
  return (
    <div
      style={{
        background: "#161616",
        border: "1px solid #2a2a2a",
        borderRadius: "8px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 16px",
          borderBottom: "1px solid #1f1f1f",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontSize: "11px",
            color: "#555",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            fontWeight: 500,
          }}
        >
          History
        </span>
        {items.length > 0 && (
          <button
            onClick={onClear}
            style={{
              background: "transparent",
              border: "none",
              color: "#444",
              fontSize: "11px",
              cursor: "pointer",
              padding: "2px 6px",
              borderRadius: "3px",
              transition: "color 150ms",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color = "#ef4444")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color = "#444")
            }
          >
            Clear all
          </button>
        )}
      </div>

      {/* Items */}
      <div style={{ overflowY: "auto", flex: 1 }}>
        {items.length === 0 ? (
          <div
            style={{
              padding: "24px 16px",
              textAlign: "center",
              color: "#333",
              fontSize: "12px",
            }}
          >
            No screenshots yet
          </div>
        ) : (
          [...items].reverse().map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className={item.id === items[items.length - 1]?.id ? "session-flash" : ""}
              style={{
                display: "block",
                width: "100%",
                padding: "12px 16px",
                background:
                  activeId === item.id ? "#1e1e1e" : "transparent",
                border: "none",
                borderBottom: "1px solid #1a1a1a",
                borderLeft: activeId === item.id ? "2px solid #f0a500" : "2px solid transparent",
                textAlign: "left",
                cursor: "pointer",
                transition: "background 100ms",
              }}
              onMouseEnter={(e) => {
                if (activeId !== item.id)
                  (e.currentTarget as HTMLButtonElement).style.background = "#1a1a1a";
              }}
              onMouseLeave={(e) => {
                if (activeId !== item.id)
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <span
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: TYPE_COLORS[item.result.type] || "#666",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: "13px",
                    color: "#d1d5db",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    flex: 1,
                  }}
                >
                  {getItemName(item.result)}
                </span>
              </div>
              <div style={{ fontSize: "11px", color: "#444", paddingLeft: "15px" }}>
                {relativeTime(item.timestamp)}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
