import { useState, useCallback, useEffect } from 'react';
import { Card } from '../types';
import philosophyData from '../data/philosophy.json';
import filterData from '../data/filters.json';
import piecesData from '../data/pieces.json';

interface DeckState {
  currentIndex: number;
  queue: Card[];
  swipeHistory: Array<{ cardId: string; direction: 'left' | 'right'; timestamp: number }>;
  collection: string[]; // IDs of cards swiped right
}

const STORAGE_KEY = 'samesisters_deck_state';

// Load state from localStorage
const loadState = (): DeckState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load deck state:', e);
  }
  return {
    currentIndex: 0,
    queue: [],
    swipeHistory: [],
    collection: []
  };
};

// Save state to localStorage
const saveState = (state: DeckState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save deck state:', e);
  }
};

export function useDeckManager() {
  const [deckState, setDeckState] = useState<DeckState>(loadState);

  // Shuffle array helper
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Initialize deck with cards in the correct order
  const initializeDeck = useCallback(() => {
    const cards: Card[] = [];
    
    // 1. Filter cards first (both of them)
    const filterCards = filterData.filters as Card[];
    cards.push(...filterCards);
    
    // 2. Collect all content cards
    const contentCards: Card[] = [];
    
    // Add philosophy cards - but only include a few (e.g., 3-4 randomly selected)
    const allPhilosophyCards = philosophyData.philosophies as Card[];
    console.log('Total philosophy cards available:', allPhilosophyCards.length);
    const selectedPhilosophy = shuffleArray(allPhilosophyCards).slice(0, 3);
    console.log('Selected philosophy cards:', selectedPhilosophy.map(c => (c as any).id));
    contentCards.push(...selectedPhilosophy);
    
    // Add all piece cards (these should dominate the deck)
    const pieceCards = piecesData.pieces as Card[];
    contentCards.push(...pieceCards);
    
    // 3. Shuffle all content cards together
    const shuffledContent = shuffleArray(contentCards);
    
    // 4. Add shuffled content after filter
    cards.push(...shuffledContent);
    
    setDeckState(prev => ({
      ...prev,
      queue: cards,
      currentIndex: 0
    }));
  }, []);

  // Handle card swipe
  const handleSwipe = useCallback((cardId: string, direction: 'left' | 'right') => {
    setDeckState(prev => {
      const newHistory = [...prev.swipeHistory, {
        cardId,
        direction,
        timestamp: Date.now()
      }];
      
      // Add to collection if swiped right and not already there
      let newCollection = prev.collection;
      if (direction === 'right') {
        if (!prev.collection.includes(cardId)) {
          newCollection = [...prev.collection, cardId];
        }
      } else {
        // Remove from collection if swiped left
        newCollection = prev.collection.filter(id => id !== cardId);
      }
      
      // Move the swiped card to the back of the queue
      const currentCard = prev.queue[prev.currentIndex];
      const newQueue = [...prev.queue];
      
      // Remove from current position
      newQueue.splice(prev.currentIndex, 1);
      // Add to the end
      newQueue.push(currentCard);
      
      // Don't increment index since we removed the current card
      // This keeps us at the same position but with a new card
      return {
        ...prev,
        queue: newQueue,
        swipeHistory: newHistory,
        collection: newCollection
      };
    });
  }, []);

  // Get current visible cards (preload next 3)
  const getVisibleCards = useCallback(() => {
    const { queue, currentIndex } = deckState;
    return queue.slice(currentIndex, currentIndex + 3);
  }, [deckState]);

  // Check if deck is empty (now it never will be)
  const isDeckEmpty = deckState.queue.length === 0;

  // Get progress info
  const getProgress = useCallback(() => {
    const { queue, currentIndex, collection } = deckState;
    return {
      total: queue.length,
      viewed: currentIndex,
      collected: collection.length,
      remaining: Math.max(0, queue.length - currentIndex)
    };
  }, [deckState]);

  // Initialize deck on mount if empty
  useEffect(() => {
    if (deckState.queue.length === 0) {
      initializeDeck();
    }
  }, [initializeDeck]);

  // Auto-save state whenever it changes
  useEffect(() => {
    saveState(deckState);
  }, [deckState]);

  // Clear all data and reset
  const clearAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setDeckState({
      currentIndex: 0,
      queue: [],
      swipeHistory: [],
      collection: []
    });
    // Force re-initialize on next render
    setTimeout(() => initializeDeck(), 0);
  }, [initializeDeck]);

  return {
    visibleCards: getVisibleCards(),
    isDeckEmpty,
    handleSwipe,
    progress: getProgress(),
    collection: deckState.collection,
    swipeHistory: deckState.swipeHistory,
    resetDeck: initializeDeck,
    clearAll
  };
}