"use client";

import { FlightTravel } from "@/lib/types";
import { useState, useEffect } from "react";
import { buildCalendarEventLink, isIOS, buildICSContent, triggerICSDownload } from "@/lib/gcal";
import ActionDivider from "@/components/ActionDivider";
import ReminderButton from "@/components/ReminderButton";

const SEGMENT_COLORS: Record<string, string> = {
  Flight: "#378ADD",
  Hotel:  "#4A7C59",
  Car:    "#8C6E50",
  Other:  "#A39E99",
};

function addHour(time: string): string {
  const [h, m] = time.split(":").map(Number);
  return `${String((h + 1) % 24).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function ActionBtn({ href, onClick, children, primary }: { href?: string; onClick?: () => void; children: React.ReactNode; primary?: boolean }) {
  const base = { display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", height: "44px", padding: "0 16px", borderRadius: "6px", fontSize: "13px", fontFamily: "var(--font-dm, 'DM Sans', sans-serif)", fontWeight: 500, cursor: "pointer", textDecoration: "none", transition: "background 150ms", border: primary ? "none" : "1px solid #D4CEC8", background: primary ? "#1A1714" : "#FFFFFF", color: primary ? "#FFFFFF" : "#1A1714" };
  const onEnter = (e: React.MouseEvent<HTMLElement>) => ((e.currentTarget as HTMLElement).style.background = primary ? "#2C2825" : "#F5F2EE");
  const onLeave = (e: React.MouseEvent<HTMLElement>) => ((e.currentTarget as HTMLElement).style.background = primary ? "#1A1714" : "#FFFFFF");
  if (onClick) return <button onClick={onClick} className="action-btn" style={base} onMouseEnter={onEnter} onMouseLeave={onLeave}><span>{children}</span><span>→</span></button>;
  return <a href={href} target="_blank" rel="noopener noreferrer" className="action-btn" style={base} onMouseEnter={onEnter} onMouseLeave={onLeave}><span>{children}</span><span>→</span></a>;
}

export default function FlightTravelCard({ data }: { data: FlightTravel }) {
  const [ios, setIos] = useState(false);
  useEffect(() => { setIos(isIOS()); }, []);

  const firstSeg = data.segments[0];
  const firstLink = firstSeg
    ? buildCalendarEventLink({ title: firstSeg.label, date: firstSeg.date, startTime: firstSeg.time, endTime: addHour(firstSeg.time) })
    : "";

  return (
    <div>
      {/* Segments */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
        {data.segments.map((seg, i) => {
          const segLink = buildCalendarEventLink({ title: seg.label, date: seg.date, startTime: seg.time, endTime: addHour(seg.time) });
          return (
            <div key={i} style={{ background: "#F5F2EE", borderRadius: "6px", padding: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontSize: "10px", fontFamily: "var(--font-dm, 'DM Sans', sans-serif)", fontWeight: 500, color: SEGMENT_COLORS[seg.type] || "#A39E99", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  {seg.type}
                </span>
                {ios ? (
                  <button
                    onClick={() => {
                      const ics = buildICSContent({ title: seg.label, date: seg.date, startTime: seg.time, endTime: addHour(seg.time), details: seg.confirmation ? `Conf: ${seg.confirmation}` : "" });
                      triggerICSDownload(ics, `${seg.label.replace(/\s+/g, "-")}.ics`);
                    }}
                    style={{ background: "transparent", border: "none", fontSize: "11px", color: "#C8A882", fontFamily: "var(--font-dm, 'DM Sans', sans-serif)", cursor: "pointer", padding: "0" }}
                  >
                    Add →
                  </button>
                ) : (
                  <a href={segLink} target="_blank" rel="noopener noreferrer" style={{ fontSize: "11px", color: "#C8A882", fontFamily: "var(--font-dm, 'DM Sans', sans-serif)", textDecoration: "none" }}>
                    Add →
                  </a>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "8px" }}>
                <span style={{ fontFamily: "var(--font-dm, 'DM Sans', sans-serif)", fontWeight: 500, fontSize: "13px", color: "#1A1714", flex: 1 }}>
                  {seg.label}
                  {seg.confirmation && (
                    <span style={{ fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)", fontSize: "11px", color: "#A39E99", marginLeft: "8px" }}>
                      {seg.confirmation}
                    </span>
                  )}
                </span>
                <span style={{ fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)", fontSize: "11px", color: "#6B6560", flexShrink: 0 }}>
                  {seg.date} {seg.time}
                </span>
              </div>
              {seg.notes && (
                <div style={{ fontFamily: "var(--font-dm, 'DM Sans', sans-serif)", fontWeight: 300, fontSize: "12px", color: "#6B6560", marginTop: "4px" }}>
                  {seg.notes}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {firstSeg && (
          ios ? (
            <ActionBtn onClick={() => {
              const ics = buildICSContent({ title: firstSeg.label, date: firstSeg.date, startTime: firstSeg.time, endTime: addHour(firstSeg.time), details: firstSeg.confirmation ? `Conf: ${firstSeg.confirmation}` : "" });
              triggerICSDownload(ics, "trip-first-segment.ics");
            }} primary>
              Add all to Calendar
            </ActionBtn>
          ) : (
            <ActionBtn href={firstLink} primary>Add all to calendar</ActionBtn>
          )
        )}
        <ActionDivider label="or set a reminder" />
        <ReminderButton
          title={`Trip: ${data.tripName}`}
          description={data.segments.map((s) => `${s.type}: ${s.label} · ${s.date} ${s.time}${s.confirmation ? ` · Conf: ${s.confirmation}` : ""}`).join("\n")}
        />
      </div>
    </div>
  );
}
