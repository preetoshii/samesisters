import { 
  Card, 
  FilterCard, 
  PieceCard, 
  PhilosophyCard, 
  FabricCard, 
  SachiMomentCard 
} from '../types';

// Import JSON data
import piecesData from '../data/pieces.json';
import fabricsData from '../data/fabrics.json';
import philosophyData from '../data/philosophy.json';
import filtersData from '../data/filters.json';
import sachiMomentsData from '../data/sachi-moments.json';

// Load all cards
export const loadAllCards = (): {
  filters: FilterCard[];
  pieces: PieceCard[];
  philosophies: PhilosophyCard[];
  fabrics: FabricCard[];
  sachiMoments: SachiMomentCard[];
} => {
  return {
    filters: filtersData.filters as FilterCard[],
    pieces: piecesData.pieces as PieceCard[],
    philosophies: philosophyData.philosophies as PhilosophyCard[],
    fabrics: fabricsData.fabrics as FabricCard[],
    sachiMoments: sachiMomentsData.sachiMoments as SachiMomentCard[],
  };
};

// Get card by ID
export const getCardById = (id: string): Card | undefined => {
  const allCards = loadAllCards();
  
  // Search through all card types
  const allCardArrays = [
    allCards.filters,
    allCards.pieces,
    allCards.philosophies,
    allCards.fabrics,
    allCards.sachiMoments,
  ];
  
  for (const cardArray of allCardArrays) {
    const found = cardArray.find(card => card.id === id);
    if (found) return found as Card;
  }
  
  return undefined;
};

// Get pieces by gender category
export const getPiecesByGender = (gender: 'feminine' | 'masculine' | 'both'): PieceCard[] => {
  const { pieces } = loadAllCards();
  
  return pieces.filter(piece => 
    piece.genderCategory === gender || piece.genderCategory === 'both'
  );
};

// Get compatible fabrics for a piece
export const getCompatibleFabrics = (pieceId: string): FabricCard[] => {
  const piece = getCardById(pieceId) as PieceCard | undefined;
  if (!piece || piece.type !== 'piece') return [];
  
  const { fabrics } = loadAllCards();
  
  return fabrics.filter(fabric => 
    piece.compatibleFabricTypes.includes(fabric.fabricType)
  );
};

// Calculate price for piece with fabric
export const calculatePrice = (pieceId: string, fabricId?: string): number => {
  const piece = getCardById(pieceId) as PieceCard | undefined;
  if (!piece || piece.type !== 'piece') return 0;
  
  let price = piece.basePrice;
  
  if (fabricId) {
    const fabric = getCardById(fabricId) as FabricCard | undefined;
    if (fabric && fabric.type === 'fabric') {
      // Add fabric surcharge if applicable
      if (piece.fabricSurcharge) {
        price += piece.fabricSurcharge;
      }
    }
  }
  
  return price;
};