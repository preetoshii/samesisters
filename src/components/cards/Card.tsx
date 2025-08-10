import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { ReactNode, useState } from 'react';
import './Card.css';

interface CardProps {
  children: ReactNode;
  onSwipe?: (direction: 'left' | 'right') => void;
  isActive?: boolean;
  index?: number;
}

export function Card({ children, onSwipe, isActive = false, index = 0 }: CardProps) {
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);
  
  // Motion values for drag
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 100;
    
    if (Math.abs(info.offset.x) > threshold) {
      const direction = info.offset.x > 0 ? 'right' : 'left';
      setExitDirection(direction);
      onSwipe?.(direction);
    }
  };

  const variants = {
    initial: {
      scale: 1 - index * 0.05,
      y: index * 10,
      opacity: index > 2 ? 0 : 1,
      zIndex: 10 - index,
    },
    active: {
      scale: 1,
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
    exit: {
      x: exitDirection === 'right' ? 300 : -300,
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      className="card"
      drag={isActive ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      initial="initial"
      animate={isActive ? 'active' : 'initial'}
      exit="exit"
      variants={variants}
      style={{
        x,
        rotate: isActive ? rotate : 0,
        opacity: isActive ? opacity : 1,
      }}
      whileDrag={{ scale: 1.05 }}
    >
      <div className="card-inner">
        {children}
      </div>
    </motion.div>
  );
}