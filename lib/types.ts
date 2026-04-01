export type DetectionType =
  | "CLIENT_CONVO"
  | "RESTAURANT"
  | "MOVIE"
  | "SOCIAL_CONTENT"
  | "MARKET_STATS"
  | "NOTE"
  | "PROPERTY_LISTING"
  | "NEW_LEAD"
  | "CONTRACT_DEADLINE"
  | "FLIGHT_TRAVEL"
  | "RECEIPT_EXPENSE"
  | "KIDS_SCHEDULE";

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

export interface PropertyListing {
  type: "PROPERTY_LISTING";
  address: string;
  price: string;
  beds: string;
  baths: string;
  sqft: string;
  daysOnMarket: string;
  mlsNumber: string;
  description: string;
  source: string;
  notes: string;
  socialCaption: string;
}

export interface NewLead {
  type: "NEW_LEAD";
  name: string;
  phone: string;
  email: string;
  intent: "Buyer" | "Seller" | "Both" | "Unknown";
  timeline: string;
  priceRange: string;
  notes: string;
  followUpTemplate: string;
}

export interface ContractDeadline {
  type: "CONTRACT_DEADLINE";
  propertyAddress: string;
  deadlines: Array<{
    label: string;
    date: string;
    critical: boolean;
  }>;
  notes: string;
}

export interface FlightTravel {
  type: "FLIGHT_TRAVEL";
  tripName: string;
  segments: Array<{
    type: "Flight" | "Hotel" | "Car" | "Other";
    label: string;
    date: string;
    time: string;
    confirmation: string;
    notes: string;
  }>;
}

export interface ReceiptExpense {
  type: "RECEIPT_EXPENSE";
  merchant: string;
  amount: string;
  date: string;
  category: "Meals" | "Marketing" | "Office" | "Travel" | "Client Gift" | "Other";
  notes: string;
  taxDeductible: boolean;
}

export interface KidsSchedule {
  type: "KIDS_SCHEDULE";
  childName: string;
  events: Array<{
    title: string;
    date: string;
    time: string;
    location: string;
    notes: string;
  }>;
}

export type AnalysisResult =
  | ClientConvoData
  | RestaurantData
  | MovieData
  | SocialContentData
  | MarketStatsData
  | NoteData
  | PropertyListing
  | NewLead
  | ContractDeadline
  | FlightTravel
  | ReceiptExpense
  | KidsSchedule;

export interface SessionItem {
  id: string;
  result: AnalysisResult;
  timestamp: number;
  imageBase64: string;
  mediaType: string;
}
