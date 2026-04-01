"use client";

import { PropertyListing } from "@/lib/types";
import { useState } from "react";
import ActionDivider from "@/components/ActionDivider";
import ReminderButton from "@/components/ReminderButton";

function Field({ label, value, index }: { label: string; value: string; index: number }) {
  return (
    <div
      className="field-cell"
      style={{ background: "#F5F2EE", padding: "10px", borderRadius: "6px", animationDelay: `${index * 40}ms` }}
    >
      <div style={{ fontFamily: "var(--font-dm, 'DM Sans', sans-serif)", fontWeight: 500, fontSize: "10px", color: "#A39E99", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "3px" }}>
        {label}
      </div>
      <div style={{ fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)", fontSize: "12px", color: "#1A1714" }}>
        {value || "—"}
      </div>
    </div>
  );
}

function ActionBtn({ href, children, primary }: { href: string; children: React.ReactNode; primary?: boolean }) {
  return (
    <a
      href={href} target="_blank" rel="noopener noreferrer" className="action-btn"
      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", height: "44px", padding: "0 16px", borderRadius: "6px", fontSize: "13px", fontFamily: "var(--font-dm, 'DM Sans', sans-serif)", fontWeight: 500, cursor: "pointer", textDecoration: "none", transition: "background 150ms", border: primary ? "none" : "1px solid #D4CEC8", background: primary ? "#1A1714" : "#FFFFFF", color: primary ? "#FFFFFF" : "#1A1714" }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = primary ? "#2C2825" : "#F5F2EE")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = primary ? "#1A1714" : "#FFFFFF")}
    >
      <span>{children}</span><span>→</span>
    </a>
  );
}

export default function PropertyListingCard({ data }: { data: PropertyListing }) {
  const [copied, setCopied] = useState(false);

  const zillowUrl = `https://www.zillow.com/homes/${encodeURIComponent(data.address)}_rb/`;
  const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(data.address)}`;

  const fields = [
    { label: "Price", value: data.price },
    { label: "Beds / Baths", value: data.beds && data.baths ? `${data.beds}bd / ${data.baths}ba` : data.beds || data.baths },
    { label: "Sqft", value: data.sqft },
    { label: "Days on Market", value: data.daysOnMarket },
    { label: "MLS #", value: data.mlsNumber },
    { label: "Source", value: data.source },
  ];

  return (
    <div>
      {data.description && (
        <div style={{ background: "#F5F2EE", borderRadius: "6px", padding: "14px", marginBottom: "20px", fontFamily: "var(--font-dm, 'DM Sans', sans-serif)", fontWeight: 300, fontSize: "13px", color: "#6B6560", lineHeight: "1.7" }}>
          {data.description}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "20px" }}>
        {fields.map((f, i) => <Field key={f.label} label={f.label} value={f.value} index={i} />)}
      </div>

      {data.notes && (
        <div style={{ background: "#F5F2EE", borderRadius: "6px", padding: "14px", marginBottom: "16px", fontFamily: "var(--font-dm, 'DM Sans', sans-serif)", fontWeight: 300, fontSize: "13px", color: "#6B6560", lineHeight: "1.7" }}>
          {data.notes}
        </div>
      )}

      {data.socialCaption && (
        <div style={{ borderLeft: "3px solid #C8A882", paddingLeft: "14px", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
            <span style={{ fontFamily: "var(--font-dm, 'DM Sans', sans-serif)", fontWeight: 500, fontSize: "10px", color: "#C8A882", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Caption ready
            </span>
            <button
              onClick={() => { navigator.clipboard.writeText(data.socialCaption); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
              style={{ background: "transparent", border: "none", fontSize: "11px", color: copied ? "#4A7C59" : "#C8A882", fontFamily: "var(--font-dm, 'DM Sans', sans-serif)", cursor: "pointer", padding: "0" }}
            >
              {copied ? "Copied ✓" : "Copy"}
            </button>
          </div>
          <div style={{ fontFamily: "var(--font-dm, 'DM Sans', sans-serif)", fontWeight: 300, fontSize: "13px", color: "#1A1714", lineHeight: "1.7" }}>
            {data.socialCaption}
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <ActionBtn href={zillowUrl} primary>Search on Zillow</ActionBtn>
        <ActionBtn href={mapsUrl}>Search on Google Maps</ActionBtn>
        <ActionDivider label="or set a reminder" />
        <ReminderButton
          title={data.address}
          description={`${data.price} · ${data.beds}bd/${data.baths}ba · ${data.sqft}sqft\nDays on market: ${data.daysOnMarket}\n${data.notes}`}
        />
      </div>
    </div>
  );
}
