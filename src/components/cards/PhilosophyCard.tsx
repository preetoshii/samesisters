import { motion } from 'framer-motion';
import { PhilosophyCard as PhilosophyCardType } from '../../types';
import './PhilosophyCard.css';

interface PhilosophyCardProps {
  card: PhilosophyCardType;
}

export function PhilosophyCard({ card }: PhilosophyCardProps) {
  console.log('PhilosophyCard render:', {
    id: card.id,
    statement: card.statement.substring(0, 30) + '...',
    backgroundMedia: card.backgroundMedia,
    mediaType: card.mediaType
  });
  return (
    <div className="philosophy-card">
      {card.backgroundMedia && (
        <motion.div
          className="philosophy-media-container"
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
          {card.mediaType === 'video' ? (
            <video 
              className="philosophy-background-media"
              src={card.backgroundMedia}
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            <img 
              className="philosophy-background-media"
              src={card.backgroundMedia}
              alt=""
              draggable={false}
            />
          )}
        </motion.div>
      )}
      <div className="philosophy-content">
        <p className="philosophy-statement">{card.statement}</p>
      </div>
    </div>
  );
}