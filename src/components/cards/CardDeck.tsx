import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Card as CardType } from '../../types';
import { Card } from './Card';
import { PhilosophyCard } from './PhilosophyCard';
import './CardDeck.css';

interface CardDeckProps {
  cards: CardType[];
  onSwipe?: (cardId: string, direction: 'left' | 'right') => void;
}

export function CardDeck({ cards, onSwipe }: CardDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const handleSwipe = (direction: 'left' | 'right') => {
    const currentCard = cards[currentIndex];
    if (currentCard && onSwipe) {
      onSwipe(currentCard.id, direction);
    }
    
    // Move to next card
    setCurrentIndex(prev => prev + 1);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentIndex >= cards.length) return;
      
      if (e.key === 'ArrowLeft') {
        handleSwipe('left');
      } else if (e.key === 'ArrowRight') {
        handleSwipe('right');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, cards.length]);

  const renderCard = (card: CardType) => {
    switch (card.type) {
      case 'philosophy':
        return <PhilosophyCard card={card} />;
      // Add other card types here as we implement them
      default:
        return <div>Card type not implemented: {card.type}</div>;
    }
  };

  // Show up to 3 cards in the stack
  const visibleCards = cards.slice(currentIndex, currentIndex + 3);

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
      
      {currentIndex >= cards.length && (
        <div className="deck-empty">
          <p>No more cards!</p>
        </div>
      )}
    </div>
  );
}