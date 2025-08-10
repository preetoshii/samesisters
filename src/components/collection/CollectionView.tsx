import { useMemo } from 'react';
import { Card as CardType } from '../../types';
import { Card } from '../cards/Card';
import { PhilosophyCard } from '../cards/PhilosophyCard';
import { FilterCard } from '../cards/FilterCard';
import { PieceCard } from '../cards/PieceCard';
import philosophyData from '../../data/philosophy.json';
import filterData from '../../data/filters.json';
import piecesData from '../../data/pieces.json';
import './CollectionView.css';

interface CollectionViewProps {
  collection: string[];
}

export function CollectionView({ collection }: CollectionViewProps) {
  // Get all cards and create a lookup map
  const cardMap = useMemo(() => {
    const map = new Map<string, CardType>();
    
    // Add filter cards
    filterData.filters.forEach((card) => {
      map.set(card.id, card as CardType);
    });
    
    // Add philosophy cards
    philosophyData.philosophies.forEach((card) => {
      map.set(card.id, card as CardType);
    });
    
    // Add piece cards
    piecesData.pieces.forEach((card) => {
      map.set(card.id, card as CardType);
    });
    
    // Later: Add fabric cards, etc.
    
    return map;
  }, []);
  
  // Get the actual card objects for the collection
  const collectionCards = useMemo(() => {
    return collection
      .map(id => cardMap.get(id))
      .filter((card): card is CardType => card !== undefined);
  }, [collection, cardMap]);
  if (collection.length === 0) {
    return (
      <div className="collection-view">
        <div className="collection-empty">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          <p>Your collection is empty</p>
          <p className="collection-hint">Swipe right on items you like!</p>
        </div>
      </div>
    );
  }

  const renderCard = (card: CardType) => {
    switch (card.type) {
      case 'philosophy':
        return <PhilosophyCard card={card as any} />;
      case 'filter':
        return <FilterCard card={card as any} />;
      case 'piece':
        return <PieceCard card={card as any} />;
      default:
        return <div>Card type not implemented: {card.type}</div>;
    }
  };

  return (
    <div className="collection-view">
      <div className="collection-header">
        <h2>Your Collection</h2>
        <p>{collectionCards.length} items saved</p>
      </div>
      <div className="collection-grid">
        {collectionCards.map((card) => (
          <div key={card.id} className="collection-item">
            <Card 
              isActive={true}
              isInCollection={false} // Don't show hearts in collection view
              // No onSwipe - these cards can't be swiped
            >
              {renderCard(card)}
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}