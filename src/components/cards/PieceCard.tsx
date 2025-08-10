import { useState } from 'react';
import { motion } from 'framer-motion';
import { PieceCard as PieceCardType } from '../../types';
import './PieceCard.css';

interface PieceCardProps {
  card: PieceCardType;
}

export function PieceCard({ card }: PieceCardProps) {
  // For non-expanded state, just show the first image
  const [currentImageIndex] = useState(0);
  
  return (
    <div className="piece-card">
      <motion.div
        className="piece-image-container"
        animate={{
          x: [0, -15, 0, 15, 0],
          y: [0, -15, 15, -15, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <img 
          src={card.images[currentImageIndex]} 
          alt={card.name}
          className="piece-image"
          draggable={false}
        />
      </motion.div>
      
      <div className="piece-info-overlay">
        <h3 className="piece-name">{card.name}</h3>
      </div>
    </div>
  );
}