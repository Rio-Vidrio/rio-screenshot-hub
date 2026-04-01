"use client";

import { useState, useEffect } from "react";

interface CalendarSetupProps {
  isUpdate?: boolean;
  onDismiss: () => void;
}

export default function CalendarSetup({ isUpdate = false, onDismiss }: CalendarSetupProps) {
  const [email, setEmail] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("calendarEmail") || "";
    setEmail(saved);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      localStorage.setItem("calendarEmail", email.trim());
    }
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
          maxWidth: "420px",
          width: "100%",
          padding: "40px",
          border: "1px solid #E8E4DF",
        }}
      >
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "22px",
            color: "#1A1714",
            margin: "0 0 10px 0",
            lineHeight: "1.3",
          }}
        >
          {isUpdate ? "Update your calendar" : "One quick thing before we start"}
        </h2>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: "14px",
            color: "#6B6560",
            margin: "0 0 28px 0",
            lineHeight: "1.6",
          }}
        >
          Which Google Calendar should we add events to?
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@gmail.com"
            autoFocus
            style={{
              width: "100%",
              padding: "12px 14px",
              border: "1px solid #D4CEC8",
              borderRadius: "6px",
              fontSize: "14px",
              fontFamily: "'DM Sans', sans-serif",
              color: "#1A1714",
              background: "#FAFAF9",
              outline: "none",
              marginBottom: "16px",
              transition: "border-color 150ms",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#C8A882")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#D4CEC8")}
          />
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
            <span>Set my calendar</span>
            <span>→</span>
          </button>
          {isUpdate && (
            <button
              type="button"
              onClick={onDismiss}
              style={{
                width: "100%",
                height: "44px",
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
