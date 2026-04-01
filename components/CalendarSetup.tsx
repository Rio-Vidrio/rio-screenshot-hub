"use client";

import { useState, useEffect } from "react";
import { CalendarPrefs } from "@/lib/gcal";

interface CalendarRow {
  label: string;
  email: string;
}

interface CalendarSetupProps {
  isUpdate?: boolean;
  onDismiss: () => void;
}

export default function CalendarSetup({ isUpdate = false, onDismiss }: CalendarSetupProps) {
  const [rows, setRows] = useState<CalendarRow[]>([{ label: "", email: "" }]);
  const [defaultIndex, setDefaultIndex] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("calendarPrefs");
      if (raw) {
        const prefs: CalendarPrefs = JSON.parse(raw);
        if (prefs.calendars.length) {
          setRows(prefs.calendars.map((c) => ({ label: c.label, email: c.email })));
          setDefaultIndex(prefs.defaultIndex);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const updateRow = (index: number, field: "label" | "email", value: string) => {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)));
    if (error) setError("");
  };

  const addRow = () => {
    if (rows.length >= 3) return;
    setRows((prev) => [...prev, { label: "", email: "" }]);
  };

  const removeRow = (index: number) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
    if (defaultIndex >= index && defaultIndex > 0) setDefaultIndex((d) => d - 1);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const primaryEmail = rows[0]?.email.trim();
    if (!primaryEmail) {
      setError("Primary calendar email is required.");
      return;
    }
    const prefs: CalendarPrefs = {
      calendars: rows
        .filter((r) => r.email.trim())
        .map((r) => ({ label: r.label.trim(), email: r.email.trim() })),
      defaultIndex,
    };
    localStorage.setItem("calendarPrefs", JSON.stringify(prefs));
    onDismiss();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(26, 23, 20, 0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "24px",
      }}
    >
      <div
        className="modal-card"
        style={{
          background: "#FFFFFF",
          borderRadius: "12px",
          maxWidth: "440px",
          width: "100%",
          padding: "28px",
          border: "1px solid #E8E4DF",
        }}
      >
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "20px",
            color: "#1A1714",
            margin: "0 0 8px 0",
            lineHeight: "1.3",
          }}
        >
          {isUpdate ? "Update your calendars" : "Set up your calendar"}
        </h2>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: "13px",
            color: "#6B6560",
            margin: "0 0 24px 0",
            lineHeight: "1.6",
          }}
        >
          Enter your primary Google Calendar email. You can add more later.
        </p>

        <form onSubmit={handleSave}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
            {rows.map((row, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  animation: index > 0 ? "fieldFadeIn 150ms ease forwards" : "none",
                }}
              >
                {/* Default radio */}
                <button
                  type="button"
                  onClick={() => setDefaultIndex(index)}
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    border: `2px solid ${defaultIndex === index ? "#C8A882" : "#D4CEC8"}`,
                    background: defaultIndex === index ? "#C8A882" : "transparent",
                    cursor: "pointer",
                    flexShrink: 0,
                    padding: 0,
                    transition: "border-color 150ms, background 150ms",
                  }}
                />

                {/* Label field — 35% */}
                <input
                  type="text"
                  value={row.label}
                  onChange={(e) => updateRow(index, "label", e.target.value)}
                  placeholder={index === 0 ? "e.g. Work" : "Label"}
                  style={{
                    width: "35%",
                    padding: "9px 10px",
                    border: "1px solid #D4CEC8",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontFamily: "'DM Sans', sans-serif",
                    color: "#1A1714",
                    background: "#FAFAF9",
                    outline: "none",
                    transition: "border-color 150ms",
                    flexShrink: 0,
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#C8A882")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#D4CEC8")}
                />

                {/* Email field — flex 1 */}
                <input
                  type="email"
                  value={row.email}
                  onChange={(e) => updateRow(index, "email", e.target.value)}
                  placeholder="you@gmail.com"
                  autoFocus={index === 0}
                  style={{
                    flex: 1,
                    padding: "9px 10px",
                    border: `1px solid ${index === 0 && error ? "#B85450" : "#D4CEC8"}`,
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontFamily: "'DM Sans', sans-serif",
                    color: "#1A1714",
                    background: "#FAFAF9",
                    outline: "none",
                    transition: "border-color 150ms",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#C8A882")}
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor =
                      index === 0 && error ? "#B85450" : "#D4CEC8")
                  }
                />

                {/* Remove button — only for non-primary rows */}
                {index > 0 ? (
                  <button
                    type="button"
                    onClick={() => removeRow(index)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#A39E99",
                      fontSize: "16px",
                      cursor: "pointer",
                      padding: "0 2px",
                      lineHeight: 1,
                      flexShrink: 0,
                      transition: "color 150ms",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.color = "#B85450")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.color = "#A39E99")
                    }
                  >
                    ×
                  </button>
                ) : (
                  <div style={{ width: "18px", flexShrink: 0 }} />
                )}
              </div>
            ))}
          </div>

          {/* Inline error */}
          {error && (
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "12px",
                color: "#B85450",
                marginBottom: "10px",
              }}
            >
              {error}
            </div>
          )}

          {/* Add another */}
          {rows.length < 3 && (
            <button
              type="button"
              onClick={addRow}
              style={{
                background: "transparent",
                border: "none",
                color: "#C8A882",
                fontSize: "13px",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 400,
                cursor: "pointer",
                padding: "0",
                marginBottom: "20px",
                display: "block",
              }}
            >
              + Add another calendar
            </button>
          )}
          {rows.length >= 3 && <div style={{ marginBottom: "20px" }} />}

          {/* Save */}
          <button
            type="submit"
            style={{
              width: "100%",
              height: "44px",
              background: "#1A1714",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "6px",
              fontSize: "14px",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 16px",
              transition: "background 150ms",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background = "#2C2825")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background = "#1A1714")
            }
          >
            <span>Save</span>
            <span>→</span>
          </button>

          {isUpdate && (
            <button
              type="button"
              onClick={onDismiss}
              style={{
                width: "100%",
                height: "40px",
                background: "transparent",
                color: "#A39E99",
                border: "none",
                borderRadius: "6px",
                fontSize: "13px",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 400,
                cursor: "pointer",
                marginTop: "8px",
                transition: "color 150ms",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = "#6B6560")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = "#A39E99")
              }
            >
              Cancel
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
