// Card Types
export type CardType = 'filter' | 'piece' | 'philosophy' | 'fabric' | 'sachi-moment';

// Gender categories
export type GenderCategory = 'feminine' | 'masculine' | 'both';

// Fabric types
export type FabricType = 'silk' | 'cotton' | 'linen' | 'wool' | 'synthetic';

// Base card interface
export interface BaseCard {
  id: string;
  type: CardType;
}

// Filter card
export interface FilterCard extends BaseCard {
  type: 'filter';
  title: string;
  image: string;
  filterType: 'gender';
  filterValue: GenderCategory;
}

// Piece card
export interface PieceCard extends BaseCard {
  type: 'piece';
  name: string;
  basePrice: number;
  images: string[];
  story: string;
  tags: string[];
  compatibleFabricTypes: FabricType[];
  genderCategory: GenderCategory;
  fabricSurcharge?: number;
}

// Philosophy card
export interface PhilosophyCard extends BaseCard {
  type: 'philosophy';
  statement: string;
  backgroundTexture?: string;
}

// Fabric card
export interface FabricCard extends BaseCard {
  type: 'fabric';
  name: string;
  fabricType: FabricType;
  video: string;
  caption: string;
  tags: string[];
  yardsAvailable: number;
  costPerYard: number;
}

// Sachi moment card
export interface SachiMomentCard extends BaseCard {
  type: 'sachi-moment';
  title: string;
  video: string;
  duration: string;
  description: string;
}

// Union type for all cards
export type Card = FilterCard | PieceCard | PhilosophyCard | FabricCard | SachiMomentCard;

// User session state
export interface UserSession {
  swipedCards: string[];
  collection: string[];
  currentDeckPosition: number;
  filterSelections: {
    gender?: GenderCategory[];
  };
  lastUpdated: string;
}

// Customization state
export interface CustomizationState {
  selectedFabricId?: string;
  height?: string;
  size?: 'S' | 'M' | 'L' | 'XL';
}

// Message options
export type MessagePlatform = 'sms' | 'whatsapp' | 'instagram';

// Admin types (for later)
export interface AdminCredentials {
  password: string;
}