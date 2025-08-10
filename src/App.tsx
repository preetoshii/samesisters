import { useState, useEffect } from 'react';
import { CardDeck } from './components/cards/CardDeck';
import { CollectionView } from './components/collection/CollectionView';
import { ThemeToggle } from './components/ui/ThemeToggle';
import { View } from './components/navigation/TabBar';
import { FloatingNav } from './components/navigation/FloatingNav';
import { SlidingLayout } from './components/layout/SlidingLayout';
import { DeckProvider, useDeck } from './contexts/DeckContext';
import './App.css';

function AppContent() {
  const [currentView, setCurrentView] = useState<View>('swipe');
  const { collection, clearAll } = useDeck();

  const handleSwipe = (cardId: string, direction: 'left' | 'right') => {
    console.log(`Card ${cardId} swiped ${direction}`);
  };

  // Debug key to reset state
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '/') {
        if (confirm('Reset all data? This will clear your collection and swipe history.')) {
          clearAll();
          window.location.reload(); // Reload to ensure clean state
        }
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [clearAll]);

  return (
    <div className="App">
      <ThemeToggle />
      
      <SlidingLayout currentView={currentView}>
        <CardDeck onSwipe={handleSwipe} />
        <CollectionView collection={collection} />
      </SlidingLayout>
      
      <FloatingNav 
        currentView={currentView}
        onViewChange={setCurrentView}
        collectionCount={collection.length}
      />
    </div>
  );
}

function App() {
  return (
    <DeckProvider>
      <AppContent />
    </DeckProvider>
  );
}

export default App;