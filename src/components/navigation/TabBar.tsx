import { useState } from 'react';
import './TabBar.css';

export type View = 'swipe' | 'collection';

interface TabBarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  collectionCount: number;
}

export function TabBar({ currentView, onViewChange, collectionCount }: TabBarProps) {
  // Audio setup
  const [clickSound] = useState(() => {
    const audio = new Audio('/sounds/click-card.wav');
    audio.volume = 0.3;
    audio.preload = 'auto';
    return audio;
  });

  const handleTabClick = (view: View) => {
    if (view !== currentView) {
      // Play click sound
      clickSound.currentTime = 0;
      clickSound.play().catch(() => {
        // Ignore audio errors
      });
      
      onViewChange(view);
    }
  };

  return (
    <nav className="tab-bar">
      <button
        className={`tab ${currentView === 'swipe' ? 'active' : ''}`}
        onClick={() => handleTabClick('swipe')}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <line x1="12" y1="6" x2="12" y2="10" />
        </svg>
        <span>Discover</span>
      </button>
      
      <button
        className={`tab ${currentView === 'collection' ? 'active' : ''}`}
        onClick={() => handleTabClick('collection')}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
        <span>Collection {collectionCount > 0 && `(${collectionCount})`}</span>
      </button>
    </nav>
  );
}