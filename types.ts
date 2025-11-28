

export interface AxisData {
  axis: string;
  value: number; // 0-100 scale
  fullMark: number;
}

export interface TimeSeriesPoint {
  date: string;
  value: number;
  event?: string; // Optional event marker
}

export interface Artist {
  id: string;
  name: string;
  birthYear: number;
  nationality: string;
  currentRank: number;
  radarData: AxisData[];
  trajectory: TimeSeriesPoint[];
  description: string;
  imageUrl: string;
  sharedMetric?: string; // The primary metric that links this artist to the search target
}

export enum AppView {
  LANDING = 'LANDING',
  OVERVIEW = 'OVERVIEW',     // Was DASHBOARD / EXHIBITION
  CONNECTED = 'CONNECTED',   // Was DISCOVERY
  DEEP_DIVE = 'DEEP_DIVE',   // Was REPORT / INTELLIGENCE
}

// Gemini Types
export interface GroundingSource {
  web?: {
    uri: string;
    title: string;
  };
}

export interface ReportHighlights {
  majorWorks: string[];
  style: string[];
  movements: string[];
  relatedArtists: string[];
  curatorNotes: string;
  personalityKeywords: string[];
}

export interface AIReportResult {
  highlights?: ReportHighlights; // Structured data for the top section
  text: string; // Full markdown report
  sources: GroundingSource[];
}

// Timeline / Journey Types
export interface TimelineContext {
  marketValue: number;
  criticalAcclaim: number;
  historical: number;
  socialImpact: number;
  institutional: number;
}

export interface TimelineEvent {
  year: number;
  title: string;
  category: 'Masterpiece' | 'Personal' | 'Scandal' | 'Exhibition';
  description: string;
  impactScore: number; // Used for Y-axis centering
  auctionHigh: number; // Normalized 0-100 for Top of Area
  auctionLow: number;  // Normalized 0-100 for Bottom of Area
  visualPrompt?: string; 
  context?: TimelineContext;
}

export interface Masterpiece {
  title: string;
  year: string;
  visualPrompt: string;
  imageUrl?: string; // Optional image URL for artwork
}

export interface TimelineEra {
  eraLabel: string; 
  ageRange: string; 
  startYear: number;
  endYear: number;
  moodColor: string; 
  summary: string;
  events: TimelineEvent[];
}

export interface CriticalQuote {
  text: string;
  author: string;
  source: string;
  year?: string;
}

export interface TimelineData {
  eras: TimelineEra[];
  critiques?: CriticalQuote[]; 
  masterpieces?: Masterpiece[]; 
  sources?: string[];
}

export interface DashboardData {
  name: string;
  nationality: string;
  birthYear: number;
  description: string;
  imageUrl: string;
  radarData: AxisData[];
  trajectory: TimeSeriesPoint[];
  rank: number;
}

// Detailed Trajectory Types for Connected Tab
export interface TrajectoryDataPoint {
  age: number;
  // Reference Artist (Artist 1)
  a1_total: number;
  a1_institution: number;
  a1_discourse: number;
  a1_academy: number;
  a1_network: number;
  a1_context?: string;

  // Selected Artist (Artist 2)
  a2_total: number;
  a2_institution: number;
  a2_discourse: number;
  a2_academy: number;
  a2_network: number;
  a2_context?: string;
}

export interface ComparativeTrajectory {
  artist1: string;
  artist2: string;
  data: TrajectoryDataPoint[];
}
