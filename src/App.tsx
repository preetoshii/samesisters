import { useState } from 'react';
import { CardDeck } from './components/cards/CardDeck';
import { CollectionView } from './components/collection/CollectionView';
import { ThemeToggle } from './components/ui/ThemeToggle';
import { TabBar, View } from './components/navigation/TabBar';
import { DeckProvider, useDeck } from './contexts/DeckContext';
import './App.css';

function AppContent() {
  const [currentView, setCurrentView] = useState<View>('swipe');
  const { collection } = useDeck();

  const handleSwipe = (cardId: string, direction: 'left' | 'right') => {
    console.log(`Card ${cardId} swiped ${direction}`);
  };

  return (
    <div className="App">
      <ThemeToggle />
      
      {currentView === 'swipe' ? (
        <CardDeck onSwipe={handleSwipe} />
      ) : (
        <CollectionView collection={collection} />
      )}
      
      <TabBar 
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