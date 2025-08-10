import { motion } from 'framer-motion';
import { FabricCard as FabricCardType } from '../../types';
import './FabricStoryCard.css';

interface FabricStoryCardProps {
  card: FabricCardType;
}

export function FabricStoryCard({ card }: FabricStoryCardProps) {
  return (
    <div className="fabric-story-card">
      <motion.div
        className="fabric-video-container"
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
        <video 
          className="fabric-video"
          src={card.video}
          autoPlay
          loop
          muted
          playsInline
        />
      </motion.div>
      
      <div className="fabric-info-overlay">
        <div className="fabric-caption">{card.caption}</div>
        <div className="fabric-tags">
          {card.tags.map((tag, index) => (
            <span key={index} className="fabric-tag">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}