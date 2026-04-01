"use client";

import { KidsSchedule } from "@/lib/types";
import { useState, useEffect } from "react";
import { buildCalendarEventLink, isIOS, buildICSContent, triggerICSDownload } from "@/lib/gcal";
import ActionDivider from "@/components/ActionDivider";
import ReminderButton from "@/components/ReminderButton";

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

export default function KidsScheduleCard({ data }: { data: KidsSchedule }) {
  const [ios, setIos] = useState(false);
  useEffect(() => { setIos(isIOS()); }, []);

  const firstEvent = data.events[0];
  const firstLink = firstEvent
    ? buildCalendarEventLink({ title: firstEvent.title, date: firstEvent.date, startTime: firstEvent.time, endTime: addHour(firstEvent.time), location: firstEvent.location })
    : "";

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0", marginBottom: "20px" }}>
        {data.events.map((ev, i) => {
          const evLink = buildCalendarEventLink({ title: ev.title, date: ev.date, startTime: ev.time, endTime: addHour(ev.time), location: ev.location });
          return (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", padding: "12px 0", borderBottom: i < data.events.length - 1 ? "1px solid #F0ECE8" : "none" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "var(--font-dm, 'DM Sans', sans-serif)", fontWeight: 500, fontSize: "13px", color: "#1A1714", marginBottom: "2px" }}>
                  {ev.title}
                </div>
                <div style={{ fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)", fontSize: "11px", color: "#A39E99" }}>
                  {ev.date} {ev.time}
                </div>
                {ev.location && (
                  <div style={{ fontFamily: "var(--font-dm, 'DM Sans', sans-serif)", fontWeight: 300, fontSize: "12px", color: "#6B6560", marginTop: "2px" }}>
                    {ev.location}
                  </div>
                )}
                {ev.notes && (
                  <div style={{ fontFamily: "var(--font-dm, 'DM Sans', sans-serif)", fontWeight: 300, fontSize: "12px", color: "#A39E99", marginTop: "2px" }}>
                    {ev.notes}
                  </div>
                )}
              </div>
              {ios ? (
                <button
                  onClick={() => {
                    const ics = buildICSContent({ title: ev.title, date: ev.date, startTime: ev.time, endTime: addHour(ev.time), location: ev.location });
                    triggerICSDownload(ics, `${ev.title.replace(/\s+/g, "-")}.ics`);
                  }}
                  style={{ background: "transparent", border: "none", fontSize: "12px", color: "#C8A882", fontFamily: "var(--font-dm, 'DM Sans', sans-serif)", cursor: "pointer", padding: "0", flexShrink: 0, marginTop: "2px" }}
                >
                  Add →
                </button>
              ) : (
                <a href={evLink} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: "12px", color: "#C8A882", fontFamily: "var(--font-dm, 'DM Sans', sans-serif)", textDecoration: "none", flexShrink: 0, marginTop: "2px" }}
                >
                  Add →
                </a>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {firstEvent && (
          ios ? (
            <ActionBtn onClick={() => {
              const ics = buildICSContent({ title: firstEvent.title, date: firstEvent.date, startTime: firstEvent.time, endTime: addHour(firstEvent.time), location: firstEvent.location });
              triggerICSDownload(ics, `${data.childName.replace(/\s+/g, "-")}-schedule.ics`);
            }} primary>
              Add all to Calendar
            </ActionBtn>
          ) : (
            <ActionBtn href={firstLink} primary>Add all to calendar</ActionBtn>
          )
        )}
        <ActionDivider label="or set a reminder" />
        <ReminderButton
          title={`${data.childName} — ${firstEvent?.title || "schedule"}`}
          description={data.events.map((e) => `${e.title}: ${e.date} ${e.time}${e.location ? ` · ${e.location}` : ""}`).join("\n")}
        />
      </div>
    </div>
  );
}
