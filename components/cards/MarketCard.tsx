"use client";

import { MarketStatsData } from "@/lib/types";

function CopyBtn({ text, label }: { text: string; label: string }) {
  return (
    <button
      onClick={() => navigator.clipboard.writeText(text)}
      style={{
        display: "block",
        width: "100%",
        padding: "10px 16px",
        background: "transparent",
        border: "1px solid #2a2a2a",
        borderRadius: "4px",
        color: "#e8e8e8",
        fontSize: "13px",
        textAlign: "left",
        cursor: "pointer",
        transition: "border-color 150ms",
        fontFamily: "'Inter', sans-serif",
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLButtonElement).style.borderColor = "#f0a500")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLButtonElement).style.borderColor = "#2a2a2a")
      }
    >
      {label} →
    </button>
  );
}

export default function MarketCard({ data }: { data: MarketStatsData }) {
  const statsText = data.keyStats.join("\n");
  const fullText = `${data.headline}\n\nKey Stats:\n${statsText}\n\nSource: ${data.source}\n\n${data.relevance}`;

  return (
    <div className="card-reveal">
      {/* Headline */}
      <div
        style={{
          fontSize: "15px",
          fontWeight: 600,
          color: "#e8e8e8",
          marginBottom: "16px",
          lineHeight: "1.4",
        }}
      >
        {data.headline}
      </div>

      {/* Source tag */}
      <div style={{ marginBottom: "16px" }}>
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
          {data.source || "Unknown source"}
        </span>
      </div>

      {/* Key stats */}
      <div style={{ marginBottom: "16px" }}>
        <div
          style={{
            color: "#666",
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "8px",
          }}
        >
          Key Stats
        </div>
        <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
          {data.keyStats.map((stat, i) => (
            <li
              key={i}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "13px",
                color: "#e8e8e8",
                padding: "6px 0",
                borderBottom: "1px solid #1f1f1f",
              }}
            >
              {stat}
            </li>
          ))}
        </ul>
      </div>

      {/* Relevance */}
      <div style={{ marginBottom: "20px" }}>
        <div
          style={{
            color: "#666",
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "8px",
          }}
        >
          Phoenix Market Relevance
        </div>
        <div
          style={{
            background: "#1a1a1a",
            border: "1px solid #2a2a2a",
            borderRadius: "6px",
            padding: "12px 14px",
            fontSize: "13px",
            color: "#aaa",
            lineHeight: "1.7",
          }}
        >
          {data.relevance}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <CopyBtn text={statsText} label="Copy stats for content" />
        <CopyBtn text={fullText} label="Copy full analysis" />
      </div>
    </div>
  );
}
