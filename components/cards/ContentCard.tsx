"use client";

import { SocialContentData } from "@/lib/types";

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

function CopyBtn({ text, label }: { text: string; label: string }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  return (
    <button
      onClick={handleCopy}
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

export default function ContentCard({ data }: { data: SocialContentData }) {
  return (
    <div className="card-reveal">
      {/* Hook highlight */}
      <div
        style={{
          borderLeft: "3px solid #f0a500",
          paddingLeft: "14px",
          marginBottom: "20px",
          fontSize: "14px",
          color: "#e8e8e8",
          lineHeight: "1.5",
          fontStyle: "italic",
        }}
      >
        {data.hook}
      </div>

      {/* Fields */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px 24px",
          marginBottom: "16px",
        }}
      >
        <Field label="Platform" value={data.platform} />
        <Field label="Content Type" value={data.contentType} />
        <Field label="Angle" value={data.angle} />
      </div>

      {/* Caption */}
      <div style={{ marginBottom: "16px" }}>
        <div style={LABEL_STYLE}>Suggested Caption</div>
        <div
          style={{
            background: "#1a1a1a",
            border: "1px solid #2a2a2a",
            borderRadius: "6px",
            padding: "12px 14px",
            marginTop: "6px",
            fontSize: "13px",
            color: "#ccc",
            lineHeight: "1.7",
          }}
        >
          {data.suggestedCaption}
        </div>
      </div>

      {/* Hashtags */}
      <div style={{ marginBottom: "20px" }}>
        <div style={LABEL_STYLE}>Hashtags</div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "12px",
            color: "#888",
            marginTop: "4px",
          }}
        >
          {data.hashtags}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <CopyBtn text={data.suggestedCaption} label="Copy caption" />
        <CopyBtn
          text={`${data.hook}\n\n${data.hashtags}`}
          label="Copy hook + hashtags"
        />
      </div>
    </div>
  );
}
