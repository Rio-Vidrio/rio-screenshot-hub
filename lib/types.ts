export type DetectionType =
  | "CLIENT_CONVO"
  | "RESTAURANT"
  | "MOVIE"
  | "SOCIAL_CONTENT"
  | "MARKET_STATS"
  | "NOTE";

export interface ClientConvoData {
  type: "CLIENT_CONVO";
  clientName: string;
  phone: string;
  email: string;
  meetingType: "Buyer Consult" | "Seller Consult" | "Showing" | "Follow-up" | "Call" | "Other";
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM 24hr
  endTime: string; // HH:MM 24hr
  notes: string;
}

export interface RestaurantData {
  type: "RESTAURANT";
  name: string;
  cuisine: string;
  priceRange: string;
  rating: string;
  hours: string;
  location: string;
  mapsQuery: string;
  reservationUrl: string;
}

export interface MovieData {
  type: "MOVIE";
  title: string;
  year: string;
  genre: string;
  rating: string;
  platform: string;
  synopsis: string;
}

export interface SocialContentData {
  type: "SOCIAL_CONTENT";
  platform: string;
  hook: string;
  angle: string;
  suggestedCaption: string;
  hashtags: string;
  contentType: "Reel" | "Post" | "Story" | "Carousel";
}

export interface MarketStatsData {
  type: "MARKET_STATS";
  headline: string;
  keyStats: string[];
  source: string;
  relevance: string;
}

export interface NoteData {
  type: "NOTE";
  title: string;
  content: string;
  category: string;
  actionable: boolean;
}

export type AnalysisResult =
  | ClientConvoData
  | RestaurantData
  | MovieData
  | SocialContentData
  | MarketStatsData
  | NoteData;

export interface SessionItem {
  id: string;
  result: AnalysisResult;
  timestamp: number;
  imageBase64: string;
  mediaType: string;
}
