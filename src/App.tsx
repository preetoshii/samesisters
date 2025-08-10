import { useState, useEffect } from 'react';
import { CardDeck } from './components/cards/CardDeck';
import { ThemeToggle } from './components/ui/ThemeToggle';
import { Card } from './types';
import philosophyData from './data/philosophy.json';
import './App.css';

function App() {
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    // Load philosophy cards for Phase 2 testing
    const philosophyCards = philosophyData.philosophies as Card[];
    setCards(philosophyCards);
  }, []);

  const handleSwipe = (cardId: string, direction: 'left' | 'right') => {
    console.log(`Card ${cardId} swiped ${direction}`);
    // In Phase 3, we'll add localStorage persistence here
  };

  return (
    <div className="App">
      <ThemeToggle />
      <CardDeck cards={cards} onSwipe={handleSwipe} />
    </div>
  );
}

export default App;