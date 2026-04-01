"use client";

import { ContractDeadline } from "@/lib/types";
import { buildCalendarEventLink, isIOS, buildICSContent, triggerICSDownload } from "@/lib/gcal";
import { useState, useEffect } from "react";
import ActionDivider from "@/components/ActionDivider";
import ReminderButton from "@/components/ReminderButton";

function isUrgent(dateStr: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = new Date(dateStr + "T00:00:00");
  const diff = (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
  return diff >= 0 && diff <= 3;
}

interface DeadlineBtnProps {
  label: string;
  date: string;
  address: string;
  ios: boolean;
}

function DeadlineCalBtn({ label, date, address, ios }: DeadlineBtnProps) {
  const link = buildCalendarEventLink({
    title: `${label} — ${address}`,
    date,
    startTime: "09:00",
    endTime: "09:30",
  });

  const handleIOS = () => {
    const ics = buildICSContent({ title: `${label} — ${address}`, date, startTime: "09:00", endTime: "09:30" });
    triggerICSDownload(ics, `${label.replace(/\s+/g, "-")}.ics`);
  };

  if (ios) {
    return (
      <button
        onClick={handleIOS}
        style={{ background: "transparent", border: "none", fontSize: "12px", color: "#C8A882", fontFamily: "var(--font-dm, 'DM Sans', sans-serif)", cursor: "pointer", padding: "0", flexShrink: 0 }}
      >
        Add →
      </button>
    );
  }
  return (
    <a href={link} target="_blank" rel="noopener noreferrer"
      style={{ fontSize: "12px", color: "#C8A882", fontFamily: "var(--font-dm, 'DM Sans', sans-serif)", textDecoration: "none", flexShrink: 0 }}
    >
      Add →
    </a>
  );
}

function ActionBtn({ href, onClick, children, primary }: { href?: string; onClick?: () => void; children: React.ReactNode; primary?: boolean }) {
  const base = { display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", height: "44px", padding: "0 16px", borderRadius: "6px", fontSize: "13px", fontFamily: "var(--font-dm, 'DM Sans', sans-serif)", fontWeight: 500, cursor: "pointer", textDecoration: "none", transition: "background 150ms", border: primary ? "none" : "1px solid #D4CEC8", background: primary ? "#1A1714" : "#FFFFFF", color: primary ? "#FFFFFF" : "#1A1714" };
  const onEnter = (e: React.MouseEvent<HTMLElement>) => ((e.currentTarget as HTMLElement).style.background = primary ? "#2C2825" : "#F5F2EE");
  const onLeave = (e: React.MouseEvent<HTMLElement>) => ((e.currentTarget as HTMLElement).style.background = primary ? "#1A1714" : "#FFFFFF");
  if (onClick) return <button onClick={onClick} className="action-btn" style={base} onMouseEnter={onEnter} onMouseLeave={onLeave}><span>{children}</span><span>→</span></button>;
  return <a href={href} target="_blank" rel="noopener noreferrer" className="action-btn" style={base} onMouseEnter={onEnter} onMouseLeave={onLeave}><span>{children}</span><span>→</span></a>;
}

export default function ContractDeadlineCard({ data }: { data: ContractDeadline }) {
  const [ios, setIos] = useState(false);
  useEffect(() => { setIos(isIOS()); }, []);

  const sorted = [...data.deadlines].sort((a, b) => a.date.localeCompare(b.date));

  const firstDeadline = sorted[0];
  const addAllLink = firstDeadline
    ? buildCalendarEventLink({ title: `${firstDeadline.label} — ${data.propertyAddress}`, date: firstDeadline.date, startTime: "09:00", endTime: "09:30" })
    : "";

  return (
    <div>
      {data.notes && (
        <div style={{ background: "#F5F2EE", borderRadius: "6px", padding: "14px", marginBottom: "20px", fontFamily: "var(--font-dm, 'DM Sans', sans-serif)", fontWeight: 300, fontSize: "13px", color: "#6B6560", lineHeight: "1.7" }}>
          {data.notes}
        </div>
      )}

      {/* Timeline */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0", marginBottom: "20px" }}>
        {sorted.map((d, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "12px 0", borderBottom: i < sorted.length - 1 ? "1px solid #F0ECE8" : "none" }}>
            {/* Dot */}
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: d.critical ? "#B85450" : "#C8A882", flexShrink: 0, marginTop: "3px" }} />
            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <span style={{ fontFamily: "var(--font-dm, 'DM Sans', sans-serif)", fontWeight: 500, fontSize: "13px", color: "#1A1714" }}>
                  {d.label}
                </span>
                {isUrgent(d.date) && (
                  <span style={{ background: "#B85450", color: "#FFFFFF", fontSize: "9px", fontFamily: "var(--font-dm, 'DM Sans', sans-serif)", fontWeight: 500, padding: "2px 6px", borderRadius: "3px", letterSpacing: "0.06em" }}>
                    URGENT
                  </span>
                )}
              </div>
              <div style={{ fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)", fontSize: "11px", color: "#A39E99", marginTop: "2px" }}>
                {d.date}
              </div>
            </div>
            <DeadlineCalBtn label={d.label} date={d.date} address={data.propertyAddress} ios={ios} />
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {firstDeadline && (
          ios ? (
            <ActionBtn onClick={() => {
              const ics = buildICSContent({ title: `${firstDeadline.label} — ${data.propertyAddress}`, date: firstDeadline.date, startTime: "09:00", endTime: "09:30" });
              triggerICSDownload(ics, "contract-deadline.ics");
            }} primary>
              Add first deadline to Calendar
            </ActionBtn>
          ) : (
            <ActionBtn href={addAllLink} primary>Add first deadline to calendar</ActionBtn>
          )
        )}
        <ActionDivider label="or set a reminder" />
        <ReminderButton
          title={`Deadlines — ${data.propertyAddress}`}
          description={sorted.map((d) => `${d.label}: ${d.date}${d.critical ? " ⚠" : ""}`).join("\n")}
        />
      </div>
    </div>
  );
}
