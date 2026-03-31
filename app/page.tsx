"use client";

import { useState, useEffect, useRef } from "react";
import UploadZone from "@/components/UploadZone";
import ResultCard from "@/components/ResultCard";
import SessionPanel from "@/components/SessionPanel";
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
      // strip data URL prefix
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function Home() {
  const [state, setState] = useState<AppState>({ status: "idle" });
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [labelIndex, setLabelIndex] = useState(0);
  const [currentFile, setCurrentFile] = useState<{ base64: string; mediaType: string } | null>(null);
  const labelCycleRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0e0e0e",
        padding: "0",
      }}
    >
      {/* Top bar */}
      <header
        style={{
          borderBottom: "1px solid #1a1a1a",
          padding: "0 24px",
          height: "52px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#f0a500",
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "13px",
              fontWeight: 500,
              color: "#e8e8e8",
              letterSpacing: "0.04em",
            }}
          >
            Rio Screenshot Hub
          </span>
        </div>
        <span
          style={{
            fontSize: "11px",
            color: "#333",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          PHX
        </span>
      </header>

      {/* Main layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gap: "24px",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "24px",
          minHeight: "calc(100vh - 52px)",
          alignItems: "start",
        }}
        className="main-grid"
      >
        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Upload zone — always visible */}
          {state.status !== "analyzing" && (
            <UploadZone
              onFile={handleFile}
              disabled={false}
            />
          )}

          {/* Analyzing state */}
          {state.status === "analyzing" && (
            <div
              style={{
                background: "#161616",
                border: "1px solid #2a2a2a",
                borderRadius: "8px",
                padding: "32px 24px",
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  color: "#666",
                  marginBottom: "12px",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {CYCLE_LABELS[labelIndex]}
              </div>
              <div
                style={{
                  height: "3px",
                  background: "#1f1f1f",
                  borderRadius: "2px",
                  overflow: "hidden",
                }}
              >
                <div
                  className="progress-fill"
                  style={{
                    height: "100%",
                    background: "#f0a500",
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
                background: "#2a0a0a",
                border: "1px solid #5a1a1a",
                borderRadius: "8px",
                padding: "20px",
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  color: "#ff6b6b",
                  marginBottom: "16px",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                Error: {state.message}
              </div>
              <button
                onClick={handleRetry}
                style={{
                  padding: "8px 16px",
                  background: "transparent",
                  border: "1px solid #5a1a1a",
                  borderRadius: "4px",
                  color: "#ff6b6b",
                  fontSize: "13px",
                  cursor: "pointer",
                  fontFamily: "'Inter', sans-serif",
                }}
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
                style={{
                  width: "100%",
                  padding: "10px 16px",
                  background: "transparent",
                  border: "1px solid #2a2a2a",
                  borderRadius: "4px",
                  color: "#555",
                  fontSize: "12px",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "'Inter', sans-serif",
                  transition: "color 150ms",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.color = "#e8e8e8")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.color = "#555")
                }
              >
                + Analyze another screenshot →
              </button>
            </>
          )}
        </div>

        {/* Right column — session history */}
        <div style={{ position: "sticky", top: "24px", maxHeight: "calc(100vh - 76px)", display: "flex", flexDirection: "column" }}>
          <SessionPanel
            items={sessions}
            activeId={activeId}
            onSelect={handleSessionSelect}
            onClear={handleClearSessions}
          />
        </div>
      </div>

      {/* Responsive styles */}
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
