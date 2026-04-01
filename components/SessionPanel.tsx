"use client";

import { SessionItem, AnalysisResult } from "@/lib/types";

const TYPE_COLORS: Record<string, string> = {
  CLIENT_CONVO: "#C8A882",
  RESTAURANT: "#4A7C59",
  MOVIE: "#8C6E50",
  SOCIAL_CONTENT: "#A39E99",
  MARKET_STATS: "#B85450",
  NOTE: "#D4CEC8",
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
        background: "#FFFFFF",
        border: "1px solid #E8E4DF",
        borderRadius: "10px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 18px",
          borderBottom: "1px solid #F0ECE8",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
            fontSize: "10px",
            color: "#A39E99",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
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
              color: "#A39E99",
              fontSize: "12px",
              fontFamily: "'DM Sans', sans-serif",
              cursor: "pointer",
              padding: "2px 6px",
              borderRadius: "3px",
              transition: "color 150ms",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color = "#B85450")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color = "#A39E99")
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
              padding: "28px 18px",
              textAlign: "center",
              color: "#A39E99",
              fontSize: "13px",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300,
            }}
          >
            No screenshots yet
          </div>
        ) : (
          [...items].reverse().map((item, index) => (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className={index === 0 ? "session-new" : ""}
              style={{
                display: "block",
                width: "100%",
                padding: "13px 18px",
                background: activeId === item.id ? "#F5F2EE" : "transparent",
                border: "none",
                borderBottom: "1px solid #F5F2EE",
                borderLeft: activeId === item.id ? "2px solid #C8A882" : "2px solid transparent",
                textAlign: "left",
                cursor: "pointer",
                transition: "background 200ms",
              }}
              onMouseEnter={(e) => {
                if (activeId !== item.id)
                  (e.currentTarget as HTMLButtonElement).style.background = "#F5F2EE";
              }}
              onMouseLeave={(e) => {
                if (activeId !== item.id)
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "4px" }}>
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "2px",
                    background: TYPE_COLORS[item.result.type] || "#A39E99",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 400,
                    fontSize: "13px",
                    color: "#1A1714",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    flex: 1,
                  }}
                >
                  {getItemName(item.result)}
                </span>
              </div>
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 300,
                  fontSize: "11px",
                  color: "#A39E99",
                  paddingLeft: "15px",
                }}
              >
                {relativeTime(item.timestamp)}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
