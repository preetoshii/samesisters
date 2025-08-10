import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';
import { BsStack } from 'react-icons/bs';
import { View } from './TabBar';
import './FloatingNav.css';

interface FloatingNavProps {
  currentView: View;
  onViewChange: (view: View) => void;
  collectionCount: number;
}

export function FloatingNav({ currentView, onViewChange, collectionCount }: FloatingNavProps) {
  // Audio setup
  const [clickSound] = useState(() => {
    const audio = new Audio('/sounds/click-card.wav');
    audio.volume = 0.3;
    audio.preload = 'auto';
    return audio;
  });

  const handleClick = (view: View) => {
    // Play click sound
    clickSound.currentTime = 0;
    clickSound.play().catch(() => {
      // Ignore audio errors
    });
    
    onViewChange(view);
  };

  return (
    <AnimatePresence mode="wait">
      {currentView === 'swipe' ? (
        <motion.div
          key="collection-button"
          className="floating-nav-wrapper right"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <svg className="speech-bubble-bg" viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="30" r="28" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="1"/>
            <path d="M12 30 L0 35 L0 25 Z" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="1" strokeLinejoin="miter"/>
          </svg>
          <button
            className="floating-nav-button"
            onClick={() => handleClick('collection')}
          >
            <FaHeart size={24} />
            {collectionCount > 0 && (
              <span className="collection-badge">{collectionCount}</span>
            )}
          </button>
        </motion.div>
      ) : (
        <motion.div
          key="discover-button"
          className="floating-nav-wrapper left"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <svg className="speech-bubble-bg" viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="30" r="28" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="1"/>
            <path d="M68 30 L80 25 L80 35 Z" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="1" strokeLinejoin="miter"/>
          </svg>
          <button
            className="floating-nav-button"
            onClick={() => handleClick('swipe')}
          >
            <BsStack size={24} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}