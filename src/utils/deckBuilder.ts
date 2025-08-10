import { Card, FilterCard, GenderCategory } from '../types';
import { loadAllCards, getPiecesByGender } from './dataLoader';

// Shuffle array using Fisher-Yates algorithm
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Build initial deck (without pieces)
export const buildInitialDeck = (): Card[] => {
  const { filters, philosophies, fabrics, sachiMoments } = loadAllCards();
  
  // Start with filter cards (they must be first)
  const deck: Card[] = [...filters];
  
  // Mix other cards
  const otherCards: Card[] = [
    ...philosophies,
    ...fabrics,
    ...sachiMoments,
  ];
  
  // Shuffle other cards
  const shuffledOthers = shuffleArray(otherCards);
  
  // Add shuffled cards to deck
  deck.push(...shuffledOthers);
  
  return deck;
};

// Add pieces to deck based on filter selections
export const addPiecesToDeck = (
  currentDeck: Card[],
  genderSelections: GenderCategory[]
): Card[] => {
  let piecesToAdd: Card[] = [];
  
  if (genderSelections.length === 0) {
    // No selection or both rejected = show both types
    const { pieces } = loadAllCards();
    piecesToAdd = pieces;
  } else {
    // Get pieces for each selected gender
    genderSelections.forEach(gender => {
      piecesToAdd.push(...getPiecesByGender(gender));
    });
    
    // Remove duplicates (pieces marked as 'both' might appear twice)
    const uniquePieces = piecesToAdd.filter((piece, index, self) =>
      index === self.findIndex(p => p.id === piece.id)
    );
    piecesToAdd = uniquePieces;
  }
  
  // Shuffle pieces
  const shuffledPieces = shuffleArray(piecesToAdd);
  
  // Find positions after filter cards to insert pieces
  const filterCount = currentDeck.filter(card => card.type === 'filter').length;
  const nonFilterCards = currentDeck.slice(filterCount);
  
  // Create new deck with pieces distributed throughout
  const newDeck: Card[] = currentDeck.slice(0, filterCount);
  
  // Calculate distribution
  const totalCards = nonFilterCards.length + shuffledPieces.length;
  const pieceInterval = Math.floor(totalCards / shuffledPieces.length);
  
  let pieceIndex = 0;
  let cardIndex = 0;
  
  // Distribute pieces throughout the deck
  for (let i = 0; i < totalCards; i++) {
    if (pieceIndex < shuffledPieces.length && i % pieceInterval === 0) {
      newDeck.push(shuffledPieces[pieceIndex]);
      pieceIndex++;
    } else if (cardIndex < nonFilterCards.length) {
      newDeck.push(nonFilterCards[cardIndex]);
      cardIndex++;
    }
  }
  
  // Add any remaining pieces or cards
  while (pieceIndex < shuffledPieces.length) {
    newDeck.push(shuffledPieces[pieceIndex]);
    pieceIndex++;
  }
  while (cardIndex < nonFilterCards.length) {
    newDeck.push(nonFilterCards[cardIndex]);
    cardIndex++;
  }
  
  return newDeck;
};

// Build complete deck based on filter selections
export const buildCompleteDeck = (genderSelections: GenderCategory[]): Card[] => {
  const initialDeck = buildInitialDeck();
  return addPiecesToDeck(initialDeck, genderSelections);
};