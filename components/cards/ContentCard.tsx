"use client";

import { SocialContentData } from "@/lib/types";
import ActionDivider from "@/components/ActionDivider";
import ReminderButton from "@/components/ReminderButton";

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
      <div
        style={{
          fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
          fontWeight: 400,
          fontSize: "12px",
          color: "#1A1714",
        }}
      >
        {value || "—"}
      </div>
    </div>
  );
}

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

export default function ContentCard({ data }: { data: SocialContentData }) {
  return (
    <div>
      {/* Hook highlight */}
      <div
        style={{
          borderLeft: "3px solid #C8A882",
          paddingLeft: "14px",
          marginBottom: "20px",
          fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
          fontStyle: "italic",
          fontSize: "14px",
          color: "#1A1714",
          lineHeight: "1.5",
        }}
      >
        {data.hook}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px",
          marginBottom: "16px",
        }}
      >
        <Field label="Platform" value={data.platform} index={0} />
        <Field label="Content Type" value={data.contentType} index={1} />
        <Field label="Angle" value={data.angle} index={2} />
      </div>

      {/* Caption */}
      <div style={{ marginBottom: "16px" }}>
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
          Suggested Caption
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
          {data.suggestedCaption}
        </div>
      </div>

      {/* Hashtags */}
      <div style={{ marginBottom: "20px" }}>
        <div
          style={{
            fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
            fontWeight: 500,
            fontSize: "10px",
            color: "#A39E99",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "6px",
          }}
        >
          Hashtags
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
            fontSize: "12px",
            color: "#6B6560",
            lineHeight: "1.6",
          }}
        >
          {data.hashtags}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <CopyBtn text={data.suggestedCaption} label="Copy caption" primary />
        <CopyBtn text={`${data.hook}\n\n${data.hashtags}`} label="Copy hook + hashtags" />
        <ActionDivider label="or set a reminder" />
        <ReminderButton
          title={data.hook}
          description={`${data.suggestedCaption}\n\n${data.hashtags}\nPlatform: ${data.platform} · ${data.contentType}`}
        />
      </div>
    </div>
  );
}
