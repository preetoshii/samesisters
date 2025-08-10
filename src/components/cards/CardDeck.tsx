import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Card as CardType } from '../../types';
import { Card } from './Card';
import { PhilosophyCard } from './PhilosophyCard';
import { useDeck } from '../../contexts/DeckContext';
import './CardDeck.css';

interface CardDeckProps {
  onSwipe?: (cardId: string, direction: 'left' | 'right') => void;
}

export function CardDeck({ onSwipe }: CardDeckProps) {
  const { visibleCards, isDeckEmpty, handleSwipe: deckHandleSwipe, progress, collection } = useDeck();
  const [keyboardSwipeDirection, setKeyboardSwipeDirection] = useState<'left' | 'right' | null>(null);
  
  const handleSwipe = (direction: 'left' | 'right') => {
    const currentCard = visibleCards[0];
    if (currentCard) {
      deckHandleSwipe(currentCard.id, direction);
      onSwipe?.(currentCard.id, direction);
      // Reset keyboard swipe state after handling
      if (keyboardSwipeDirection) {
        setTimeout(() => setKeyboardSwipeDirection(null), 100);
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isDeckEmpty) return;
      
      if (e.key === 'ArrowLeft') {
        setKeyboardSwipeDirection('left');
        // Delay handleSwipe to allow animation to start
        setTimeout(() => handleSwipe('left'), 50);
      } else if (e.key === 'ArrowRight') {
        setKeyboardSwipeDirection('right');
        // Delay handleSwipe to allow animation to start
        setTimeout(() => handleSwipe('right'), 50);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDeckEmpty, handleSwipe]);

  const renderCard = (card: CardType) => {
    switch (card.type) {
      case 'philosophy':
        return <PhilosophyCard card={card} />;
      // Add other card types here as we implement them
      default:
        return <div>Card type not implemented: {card.type}</div>;
    }
  };

  return (
    <div className="card-deck">
      <AnimatePresence>
        {visibleCards.map((card, index) => (
          <Card
            key={card.id}
            onSwipe={handleSwipe}
            isActive={index === 0}
            index={index}
            isInCollection={collection.includes(card.id)}
            keyboardSwipe={index === 0 ? keyboardSwipeDirection : null}
          >
            {renderCard(card)}
          </Card>
        ))}
      </AnimatePresence>
      
      {isDeckEmpty && (
        <div className="deck-empty">
          <p>No more cards!</p>
          <p className="deck-stats">
            {progress.collected} items in your collection
          </p>
        </div>
      )}
    </div>
  );
}