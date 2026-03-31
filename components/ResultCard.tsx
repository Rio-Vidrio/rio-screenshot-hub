"use client";

import { AnalysisResult } from "@/lib/types";
import ClientCard from "./cards/ClientCard";
import RestaurantCard from "./cards/RestaurantCard";
import MovieCard from "./cards/MovieCard";
import ContentCard from "./cards/ContentCard";
import MarketCard from "./cards/MarketCard";
import NoteCard from "./cards/NoteCard";

const TYPE_LABELS: Record<string, string> = {
  CLIENT_CONVO: "CLIENT",
  RESTAURANT: "RESTAURANT",
  MOVIE: "MOVIE",
  SOCIAL_CONTENT: "CONTENT",
  MARKET_STATS: "MARKET",
  NOTE: "NOTE",
};

function getTitle(result: AnalysisResult): string {
  switch (result.type) {
    case "CLIENT_CONVO":
      return result.clientName || "Client Conversation";
    case "RESTAURANT":
      return result.name;
    case "MOVIE":
      return result.title;
    case "SOCIAL_CONTENT":
      return result.hook.slice(0, 60) + (result.hook.length > 60 ? "…" : "");
    case "MARKET_STATS":
      return result.headline.slice(0, 60) + (result.headline.length > 60 ? "…" : "");
    case "NOTE":
      return result.title;
  }
}

interface ResultCardProps {
  result: AnalysisResult;
  onRetry?: () => void;
}

export default function ResultCard({ result }: ResultCardProps) {
  const typeLabel = TYPE_LABELS[result.type] || result.type;
  const title = getTitle(result);

  return (
    <div
      style={{
        background: "#161616",
        border: "1px solid #2a2a2a",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid #1f1f1f",
          display: "flex",
          alignItems: "flex-start",
          gap: "12px",
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "10px",
            fontWeight: 500,
            color: "#0e0e0e",
            background: "#f0a500",
            padding: "3px 7px",
            borderRadius: "3px",
            letterSpacing: "0.1em",
            flexShrink: 0,
            marginTop: "2px",
          }}
        >
          {typeLabel}
        </span>
        <span
          style={{
            fontSize: "14px",
            fontWeight: 500,
            color: "#e8e8e8",
            lineHeight: "1.4",
          }}
        >
          {title}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: "20px" }}>
        {result.type === "CLIENT_CONVO" && <ClientCard data={result} />}
        {result.type === "RESTAURANT" && <RestaurantCard data={result} />}
        {result.type === "MOVIE" && <MovieCard data={result} />}
        {result.type === "SOCIAL_CONTENT" && <ContentCard data={result} />}
        {result.type === "MARKET_STATS" && <MarketCard data={result} />}
        {result.type === "NOTE" && <NoteCard data={result} />}
      </div>
    </div>
  );
}
