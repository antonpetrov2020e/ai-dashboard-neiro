export interface Tool {
  id: string;
  name: string;
  category: string;
  description: string;
  link: string;
  useCases: string; // Stored as a single string
  imageUrl?: string;
  pricing?: string; // New field for pricing model (e.g., "Free", "Paid")
  score?: number;   // New field for rating (e.g., 10, 9, 8)
  status?: 'active' | 'cancelled' | 'inactive'; // active = Currently in use/paid
  paymentLink?: string; // Link to payment service (e.g. ggsel or telegram bot)
}

export interface AppConfig {
  googleSheetUrl: string;
  title: string;
  description: string;
}

export enum SortOption {
  NAME_ASC = 'Name (A-Z)',
  NAME_DESC = 'Name (Z-A)',
  CATEGORY = 'Category',
  SCORE_DESC = 'Highest Score'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}