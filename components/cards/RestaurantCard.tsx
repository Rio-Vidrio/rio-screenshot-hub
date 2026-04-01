"use client";

import { RestaurantData } from "@/lib/types";
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
          fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
          fontSize: "12px",
          color: "#1A1714",
        }}
      >
        {value || "—"}
      </div>
    </div>
  );
}

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

export default function RestaurantCard({ data }: { data: RestaurantData }) {
  const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(data.mapsQuery)}`;
  const shareText = `${data.name} — ${data.cuisine} ${data.priceRange} | ${mapsUrl}`;

  const fields = [
    { label: "Name", value: data.name },
    { label: "Cuisine", value: data.cuisine },
    { label: "Price", value: data.priceRange },
    { label: "Rating", value: data.rating },
    { label: "Hours", value: data.hours },
    { label: "Location", value: data.location },
  ];

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px",
          marginBottom: "20px",
        }}
      >
        {fields.map((f, i) => (
          <Field key={f.label} label={f.label} value={f.value} index={i} />
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <ActionBtn href={mapsUrl} primary>Open in Google Maps</ActionBtn>
        {data.reservationUrl && (
          <ActionBtn href={data.reservationUrl}>Reserve a table</ActionBtn>
        )}
        <ActionBtn onClick={() => navigator.clipboard.writeText(shareText)}>
          Copy share text
        </ActionBtn>
        <ActionDivider label="or set a reminder" />
        <ReminderButton
          title={data.name}
          description={`${data.cuisine} · ${data.priceRange} · ${data.location}\nMaps: https://maps.google.com/?q=${encodeURIComponent(data.mapsQuery)}`}
        />
      </div>
    </div>
  );
}
