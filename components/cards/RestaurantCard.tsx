"use client";

import { RestaurantData } from "@/lib/types";
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

export default function RestaurantCard({ data }: { data: RestaurantData }) {
  const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(data.mapsQuery)}`;
  const reminderLink = buildReminderLink({
    title: `Dinner — ${data.name}`,
    details: `${mapsUrl}`,
  });

  const shareText = `${data.name} — ${data.cuisine} ${data.priceRange} | ${mapsUrl}`;

  const handleCopyShare = () => {
    navigator.clipboard.writeText(shareText);
  };

  return (
    <div className="card-reveal">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px 24px",
          marginBottom: "20px",
        }}
      >
        <Field label="Name" value={data.name} />
        <Field label="Cuisine" value={data.cuisine} />
        <Field label="Price" value={data.priceRange} />
        <Field label="Rating" value={data.rating} />
        <Field label="Hours" value={data.hours} />
        <Field label="Location" value={data.location} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <ActionBtn href={mapsUrl}>Open in Google Maps</ActionBtn>
        {data.reservationUrl && (
          <ActionBtn href={data.reservationUrl}>Reserve a table</ActionBtn>
        )}
        <ActionBtn href={reminderLink}>Remind me at 8PM</ActionBtn>
        <ActionBtn onClick={handleCopyShare}>Copy share text</ActionBtn>
      </div>
    </div>
  );
}
