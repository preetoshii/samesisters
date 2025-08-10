import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { Card as CardType } from '../../types';
import { Card } from './Card';
import { PhilosophyCard } from './PhilosophyCard';
import { useDeck } from '../../contexts/DeckContext';
import './CardDeck.css';

interface CardDeckProps {
  onSwipe?: (cardId: string, direction: 'left' | 'right') => void;
}

export function CardDeck({ onSwipe }: CardDeckProps) {
  const { visibleCards, isDeckEmpty, handleSwipe: deckHandleSwipe, progress } = useDeck();
  
  const handleSwipe = (direction: 'left' | 'right') => {
    const currentCard = visibleCards[0];
    if (currentCard) {
      deckHandleSwipe(currentCard.id, direction);
      onSwipe?.(currentCard.id, direction);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isDeckEmpty) return;
      
      if (e.key === 'ArrowLeft') {
        handleSwipe('left');
      } else if (e.key === 'ArrowRight') {
        handleSwipe('right');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDeckEmpty, visibleCards]);

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