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
  onOpenCalendarSetup?: () => void;
}

export default function ResultCard({ result, onOpenCalendarSetup }: ResultCardProps) {
  const typeLabel = TYPE_LABELS[result.type] || result.type;
  const title = getTitle(result);

  return (
    <div
      className="card-reveal"
      style={{
        background: "#FFFFFF",
        border: "1px solid #E8E4DF",
        borderLeft: "3px solid #C8A882",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "20px 28px 16px",
          borderBottom: "1px solid #F0ECE8",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
            fontWeight: 500,
            fontSize: "10px",
            color: "#C8A882",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: "6px",
          }}
        >
          {typeLabel}
        </div>
        <div
          style={{
            fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
            fontWeight: 400,
            fontSize: "18px",
            color: "#1A1714",
            lineHeight: "1.35",
          }}
        >
          {title}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "24px 28px" }}>
        {result.type === "CLIENT_CONVO" && <ClientCard data={result} onOpenCalendarSetup={onOpenCalendarSetup} />}
        {result.type === "RESTAURANT" && <RestaurantCard data={result} />}
        {result.type === "MOVIE" && <MovieCard data={result} />}
        {result.type === "SOCIAL_CONTENT" && <ContentCard data={result} />}
        {result.type === "MARKET_STATS" && <MarketCard data={result} />}
        {result.type === "NOTE" && <NoteCard data={result} />}
      </div>
    </div>
  );
}
