"use client";

import { useState, useEffect, useRef } from "react";
import UploadZone from "@/components/UploadZone";
import ResultCard from "@/components/ResultCard";
import SessionPanel from "@/components/SessionPanel";
import CalendarSetup from "@/components/CalendarSetup";
import { AnalysisResult, SessionItem } from "@/lib/types";

const STORAGE_KEY = "rio-screenshot-hub-sessions";

type AppState =
  | { status: "idle" }
  | { status: "analyzing" }
  | { status: "result"; result: AnalysisResult }
  | { status: "error"; message: string };

const CYCLE_LABELS = ["Reading screenshot...", "Routing..."];

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function GearIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 10a2 2 0 100-4 2 2 0 000 4z"
        stroke="#A39E99"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M13.3 6.7l-.8-.5a5.2 5.2 0 000-0.4l.8-.5a.6.6 0 00.2-.8l-1-1.7a.6.6 0 00-.8-.2l-.9.5a5 5 0 00-.7-.4V2a.6.6 0 00-.6-.6H6.5A.6.6 0 005.9 2v1a5 5 0 00-.7.4l-.9-.5a.6.6 0 00-.8.2l-1 1.7a.6.6 0 00.2.8l.8.5a5.2 5.2 0 000 .4l-.8.5a.6.6 0 00-.2.8l1 1.7a.6.6 0 00.8.2l.9-.5c.2.1.4.3.7.4v1c0 .3.3.6.6.6H9.5c.3 0 .6-.3.6-.6v-1c.3-.1.5-.2.7-.4l.9.5c.3.1.6 0 .8-.2l1-1.7a.6.6 0 00-.2-.8z"
        stroke="#A39E99"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Home() {
  const [state, setState] = useState<AppState>({ status: "idle" });
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [labelIndex, setLabelIndex] = useState(0);
  const [currentFile, setCurrentFile] = useState<{ base64: string; mediaType: string } | null>(null);
  const [showCalendarSetup, setShowCalendarSetup] = useState(false);
  const [calendarSetupIsUpdate, setCalendarSetupIsUpdate] = useState(false);
  const labelCycleRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Check for calendar email on first load
  useEffect(() => {
    const email = localStorage.getItem("calendarEmail");
    if (!email) {
      setCalendarSetupIsUpdate(false);
      setShowCalendarSetup(true);
    }
  }, []);

  // Load sessions from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as SessionItem[];
        setSessions(parsed);
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist sessions
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch {
      // ignore
    }
  }, [sessions]);

  // Label cycling during analysis
  useEffect(() => {
    if (state.status === "analyzing") {
      setLabelIndex(0);
      labelCycleRef.current = setInterval(() => {
        setLabelIndex((i) => (i + 1) % CYCLE_LABELS.length);
      }, 1500);
    } else {
      if (labelCycleRef.current) clearInterval(labelCycleRef.current);
    }
    return () => {
      if (labelCycleRef.current) clearInterval(labelCycleRef.current);
    };
  }, [state.status]);

  const analyze = async (base64: string, mediaType: string) => {
    setState({ status: "analyzing" });
    setCurrentFile({ base64, mediaType });

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, mediaType }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");

      const result = data as AnalysisResult;
      const item: SessionItem = {
        id: crypto.randomUUID(),
        result,
        timestamp: Date.now(),
        imageBase64: base64,
        mediaType,
      };

      setSessions((prev) => [...prev, item]);
      setActiveId(item.id);
      setState({ status: "result", result });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setState({ status: "error", message });
    }
  };

  const handleFile = async (file: File) => {
    const base64 = await fileToBase64(file);
    const mediaType = file.type as "image/jpeg" | "image/png" | "image/gif" | "image/webp";
    await analyze(base64, mediaType);
  };

  const handleSessionSelect = (item: SessionItem) => {
    setActiveId(item.id);
    setState({ status: "result", result: item.result });
    setCurrentFile({ base64: item.imageBase64, mediaType: item.mediaType });
  };

  const handleClearSessions = () => {
    setSessions([]);
    setActiveId(null);
    setState({ status: "idle" });
  };

  const handleRetry = () => {
    if (currentFile) {
      analyze(currentFile.base64, currentFile.mediaType);
    } else {
      setState({ status: "idle" });
    }
  };

  const openCalendarSettings = () => {
    setCalendarSetupIsUpdate(true);
    setShowCalendarSetup(true);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAF9" }}>
      {/* Calendar setup modal */}
      {showCalendarSetup && (
        <CalendarSetup
          isUpdate={calendarSetupIsUpdate}
          onDismiss={() => setShowCalendarSetup(false)}
        />
      )}

      {/* Top bar */}
      <header
        style={{
          borderBottom: "1px solid #E8E4DF",
          padding: "0 28px",
          height: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#FFFFFF",
        }}
      >
        <span
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 400,
            fontSize: "15px",
            color: "#1A1714",
            letterSpacing: "0.01em",
          }}
        >
          Rio Screenshot Hub
        </span>
        <button
          onClick={openCalendarSettings}
          title="Calendar settings"
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "6px",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 150ms",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background = "#F5F2EE")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background = "transparent")
          }
        >
          <GearIcon />
        </button>
      </header>

      {/* Main layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 300px",
          gap: "28px",
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "28px",
          minHeight: "calc(100vh - 56px)",
          alignItems: "start",
        }}
        className="main-grid"
      >
        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* Upload zone */}
          {state.status !== "analyzing" && (
            <UploadZone onFile={handleFile} disabled={false} />
          )}

          {/* Analyzing state */}
          {state.status === "analyzing" && (
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #E8E4DF",
                borderRadius: "10px",
                padding: "36px 28px",
              }}
            >
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 300,
                  fontSize: "13px",
                  color: "#6B6560",
                  marginBottom: "14px",
                }}
              >
                {CYCLE_LABELS[labelIndex]}
              </div>
              <div
                style={{
                  height: "3px",
                  background: "#F0ECE8",
                  borderRadius: "2px",
                  overflow: "hidden",
                }}
              >
                <div
                  className="progress-fill"
                  style={{
                    height: "100%",
                    background: "#C8A882",
                    borderRadius: "2px",
                    width: "0%",
                  }}
                />
              </div>
            </div>
          )}

          {/* Error state */}
          {state.status === "error" && (
            <div
              style={{
                background: "#FDF5F5",
                border: "1px solid #E8C8C8",
                borderLeft: "3px solid #B85450",
                borderRadius: "10px",
                padding: "24px 28px",
              }}
            >
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "13px",
                  color: "#B85450",
                  marginBottom: "16px",
                }}
              >
                {state.message}
              </div>
              <button
                onClick={handleRetry}
                className="action-btn"
                style={{
                  padding: "10px 18px",
                  background: "#1A1714",
                  border: "none",
                  borderRadius: "6px",
                  color: "#FFFFFF",
                  fontSize: "13px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "background 150ms",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.background = "#2C2825")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.background = "#1A1714")
                }
              >
                Retry →
              </button>
            </div>
          )}

          {/* Result */}
          {state.status === "result" && (
            <>
              <ResultCard result={state.result} />
              <button
                onClick={() => setState({ status: "idle" })}
                className="action-btn"
                style={{
                  width: "100%",
                  height: "44px",
                  padding: "0 18px",
                  background: "transparent",
                  border: "1px solid #D4CEC8",
                  borderRadius: "6px",
                  color: "#6B6560",
                  fontSize: "13px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 400,
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "background 150ms, color 150ms",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "#F5F2EE";
                  (e.currentTarget as HTMLButtonElement).style.color = "#1A1714";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = "#6B6560";
                }}
              >
                <span>Analyze another screenshot</span>
                <span>→</span>
              </button>
            </>
          )}
        </div>

        {/* Right column — session history */}
        <div
          style={{
            position: "sticky",
            top: "28px",
            maxHeight: "calc(100vh - 84px)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <SessionPanel
            items={sessions}
            activeId={activeId}
            onSelect={handleSessionSelect}
            onClear={handleClearSessions}
          />
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .main-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
