import { UserSession, GenderCategory } from '../types';

const SESSION_KEY = 'samesisters_session';

// Get default session
const getDefaultSession = (): UserSession => ({
  swipedCards: [],
  collection: [],
  currentDeckPosition: 0,
  filterSelections: {},
  lastUpdated: new Date().toISOString(),
});

// Load session from localStorage
export const loadSession = (): UserSession => {
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      return JSON.parse(stored) as UserSession;
    }
  } catch (error) {
    console.error('Error loading session:', error);
  }
  return getDefaultSession();
};

// Save session to localStorage
export const saveSession = (session: UserSession): void => {
  try {
    session.lastUpdated = new Date().toISOString();
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('Error saving session:', error);
  }
};

// Update session with partial data
export const updateSession = (updates: Partial<UserSession>): UserSession => {
  const currentSession = loadSession();
  const updatedSession = { ...currentSession, ...updates };
  saveSession(updatedSession);
  return updatedSession;
};

// Add card to collection
export const addToCollection = (cardId: string): void => {
  const session = loadSession();
  if (!session.collection.includes(cardId)) {
    session.collection.push(cardId);
    saveSession(session);
  }
};

// Remove card from collection
export const removeFromCollection = (cardId: string): void => {
  const session = loadSession();
  session.collection = session.collection.filter(id => id !== cardId);
  saveSession(session);
};

// Record swipe
export const recordSwipe = (cardId: string, direction: 'left' | 'right'): void => {
  const session = loadSession();
  
  // Add to swiped cards
  if (!session.swipedCards.includes(cardId)) {
    session.swipedCards.push(cardId);
  }
  
  // If swiped right, add to collection
  if (direction === 'right') {
    addToCollection(cardId);
  }
  
  // Increment deck position
  session.currentDeckPosition++;
  
  saveSession(session);
};

// Update filter selections
export const updateFilterSelections = (gender: GenderCategory, selected: boolean): void => {
  const session = loadSession();
  
  if (!session.filterSelections.gender) {
    session.filterSelections.gender = [];
  }
  
  if (selected) {
    if (!session.filterSelections.gender.includes(gender)) {
      session.filterSelections.gender.push(gender);
    }
  } else {
    session.filterSelections.gender = session.filterSelections.gender.filter(g => g !== gender);
  }
  
  saveSession(session);
};

// Clear session
export const clearSession = (): void => {
  localStorage.removeItem(SESSION_KEY);
};

// Check if card has been swiped
export const hasSwipedCard = (cardId: string): boolean => {
  const session = loadSession();
  return session.swipedCards.includes(cardId);
};

// Get collection
export const getCollection = (): string[] => {
  const session = loadSession();
  return session.collection;
};