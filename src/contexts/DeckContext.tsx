import { createContext, useContext, ReactNode } from 'react';
import { useDeckManager } from '../hooks/useDeckManager';

type DeckContextType = ReturnType<typeof useDeckManager>;

const DeckContext = createContext<DeckContextType | null>(null);

export function DeckProvider({ children }: { children: ReactNode }) {
  const deckManager = useDeckManager();
  
  return (
    <DeckContext.Provider value={deckManager}>
      {children}
    </DeckContext.Provider>
  );
}

export function useDeck() {
  const context = useContext(DeckContext);
  if (!context) {
    throw new Error('useDeck must be used within a DeckProvider');
  }
  return context;
}