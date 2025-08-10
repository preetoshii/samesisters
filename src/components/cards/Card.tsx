import { motion, useMotionValue, useTransform, PanInfo, useAnimation } from 'framer-motion';
import { ReactNode, useState, useEffect } from 'react';
import './Card.css';

interface CardProps {
  children: ReactNode;
  onSwipe?: (direction: 'left' | 'right') => void;
  isActive?: boolean;
  index?: number;
}

export function Card({ children, onSwipe, isActive = false, index = 0 }: CardProps) {
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [hasHitThreshold, setHasHitThreshold] = useState(false);
  
  // Adaptive values based on screen width - fully proportional
  const screenWidth = window.innerWidth;
  
  // Swipe threshold: ~25% of screen width
  const SWIPE_THRESHOLD = screenWidth * 0.25;
  
  // Rotation range: ~50% of screen width
  const ROTATION_RANGE = screenWidth * 0.5;
  
  // Motion values for drag
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-ROTATION_RANGE, ROTATION_RANGE], [-30, 30]);
  const rotateY = useTransform(y, [-200, 200], [5, -5]); // Subtle 3D tilt
  

  const handlePointerDown = () => {
    setIsPressed(true);
    // Haptic feedback on press
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  const handlePointerUp = () => {
    setIsPressed(false);
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = async (_: any, info: PanInfo) => {
    setIsDragging(false);
    setIsPressed(false);
    setHasHitThreshold(false);
    
    const SWIPE_VELOCITY_THRESHOLD = 500;
    
    // Check horizontal movement for swipe
    const shouldSwipe = Math.abs(info.offset.x) > SWIPE_THRESHOLD || 
                       Math.abs(info.velocity.x) > SWIPE_VELOCITY_THRESHOLD;
    
    if (shouldSwipe) {
      const direction = info.offset.x > 0 ? 'right' : 'left';
      setExitDirection(direction);
      onSwipe?.(direction);
    }
  };

  // Monitor x position for threshold feedback
  useEffect(() => {
    if (!isDragging) return;
    
    const unsubscribe = x.onChange((latest) => {
      const hitThreshold = Math.abs(latest) >= SWIPE_THRESHOLD;
      
      if (hitThreshold && !hasHitThreshold) {
        // Haptic feedback when crossing threshold
        if ('vibrate' in navigator) {
          navigator.vibrate(20);
        }
        setHasHitThreshold(true);
      } else if (!hitThreshold && hasHitThreshold) {
        setHasHitThreshold(false);
      }
    });

    return unsubscribe;
  }, [x, SWIPE_THRESHOLD, hasHitThreshold, isDragging]);

  const variants = {
    initial: {
      scale: 1 - index * 0.05,
      y: index * 10,
      opacity: index > 2 ? 0 : 1,
      zIndex: 10 - index,
      x: 0,
    },
    active: {
      scale: 1,
      y: 0,
      x: 0,
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

  // Calculate current scale based on state
  const currentScale = isPressed ? (hasHitThreshold ? 1.15 : 1.05) : 1;

  return (
    <motion.div
      className="card"
      drag={isActive ? true : false}
      dragSnapToOrigin={true}
      dragConstraints={{ 
        left: -window.innerWidth * 0.4, 
        right: window.innerWidth * 0.4,
        top: -window.innerHeight * 0.3,
        bottom: window.innerHeight * 0.3
      }}
      dragElastic={0.15}
      dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
      onDragEnd={handleDragEnd}
      initial="initial"
      animate={isActive ? 'active' : 'initial'}
      exit="exit"
      variants={variants}
      style={{
        x,
        y,
        rotate: isActive ? rotate : 0,
        rotateX: isActive ? rotateY : 0,
      }}
      onDragStart={handleDragStart}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <motion.div 
        className="card-inner"
        animate={{ scale: currentScale }}
        transition={{
          scale: {
            type: "spring",
            stiffness: hasHitThreshold ? 700 : 400,
            damping: hasHitThreshold ? 15 : 25
          }
        }}
      >
        {children}
      </motion.div>
      {!isActive && (
        <div 
          className="card-overlay"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'var(--color-card-overlay)',
            pointerEvents: 'none',
            borderRadius: '10px',
            zIndex: 10
          }}
        />
      )}
    </motion.div>
  );
}