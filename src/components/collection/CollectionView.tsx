import './CollectionView.css';

interface CollectionViewProps {
  collection: string[];
}

export function CollectionView({ collection }: CollectionViewProps) {
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

  return (
    <div className="collection-view">
      <div className="collection-header">
        <h2>Your Collection</h2>
        <p>{collection.length} items saved</p>
      </div>
      <div className="collection-grid">
        {collection.map((itemId) => (
          <div key={itemId} className="collection-item">
            <div className="collection-item-placeholder">
              {itemId}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}