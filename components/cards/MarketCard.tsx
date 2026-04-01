"use client";

import { MarketStatsData } from "@/lib/types";
import ActionDivider from "@/components/ActionDivider";
import ReminderButton from "@/components/ReminderButton";

function CopyBtn({ text, label, primary }: { text: string; label: string; primary?: boolean }) {
  return (
    <button
      onClick={() => navigator.clipboard.writeText(text)}
      className="action-btn"
      style={{
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
        transition: "background 150ms",
        border: primary ? "none" : "1px solid #D4CEC8",
        background: primary ? "#1A1714" : "#FFFFFF",
        color: primary ? "#FFFFFF" : "#1A1714",
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLButtonElement).style.background = primary ? "#2C2825" : "#F5F2EE")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLButtonElement).style.background = primary ? "#1A1714" : "#FFFFFF")
      }
    >
      <span>{label}</span>
      <span>→</span>
    </button>
  );
}

export default function MarketCard({ data }: { data: MarketStatsData }) {
  const statsText = data.keyStats.join("\n");
  const fullText = `${data.headline}\n\nKey Stats:\n${statsText}\n\nSource: ${data.source}\n\n${data.relevance}`;

  return (
    <div>
      {/* Source tag */}
      <div style={{ marginBottom: "16px" }}>
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
          {data.source || "Unknown source"}
        </span>
      </div>

      {/* Key stats */}
      <div style={{ marginBottom: "18px" }}>
        <div
          style={{
            fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
            fontWeight: 500,
            fontSize: "10px",
            color: "#A39E99",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "10px",
          }}
        >
          Key Stats
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          {data.keyStats.map((stat, i) => (
            <div
              key={i}
              className="field-cell"
              style={{
                background: "#F5F2EE",
                borderRadius: "6px",
                padding: "10px 12px",
                fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                fontSize: "12px",
                color: "#1A1714",
                animationDelay: `${i * 40}ms`,
              }}
            >
              {stat}
            </div>
          ))}
        </div>
      </div>

      {/* Relevance */}
      <div style={{ marginBottom: "20px" }}>
        <div
          style={{
            fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
            fontWeight: 500,
            fontSize: "10px",
            color: "#A39E99",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "8px",
          }}
        >
          Phoenix Market Relevance
        </div>
        <div
          style={{
            background: "#F5F2EE",
            borderRadius: "6px",
            padding: "14px",
            fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
            fontWeight: 300,
            fontSize: "13px",
            color: "#1A1714",
            lineHeight: "1.7",
          }}
        >
          {data.relevance}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <CopyBtn text={statsText} label="Copy stats for content" primary />
        <CopyBtn text={fullText} label="Copy full analysis" />
        <ActionDivider label="or set a reminder" />
        <ReminderButton
          title={data.headline}
          description={`${data.keyStats.join('\n')}\n\n${data.relevance}\nSource: ${data.source}`}
        />
      </div>
    </div>
  );
}
