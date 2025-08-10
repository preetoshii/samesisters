import { motion } from 'framer-motion';
import { FilterCard as FilterCardType } from '../../types';
import './FilterCard.css';

interface FilterCardProps {
  card: FilterCardType;
}

export function FilterCard({ card }: FilterCardProps) {
  return (
    <div className="filter-card">
      <motion.div
        className="filter-image-container"
        animate={{
          x: [0, -15, 0, 15, 0],
          y: [0, -15, 15, -15, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          backgroundImage: `url(${card.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="filter-info-overlay">
        <h3 className="filter-title">{card.title}</h3>
      </div>
    </div>
  );
}