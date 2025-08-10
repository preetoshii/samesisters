import { motion, useMotionValue, useTransform, PanInfo, useAnimation, AnimatePresence } from 'framer-motion';
import { ReactNode, useState, useEffect } from 'react';
import './Card.css';

interface CardProps {
  children: ReactNode;
  onSwipe?: (direction: 'left' | 'right') => void;
  isActive?: boolean;
  index?: number;
  isInCollection?: boolean;
  keyboardSwipe?: 'left' | 'right' | null;
}

export function Card({ children, onSwipe, isActive = false, index = 0, isInCollection = false, keyboardSwipe = null }: CardProps) {
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [hasHitThreshold, setHasHitThreshold] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right'>('right');
  
  // Audio setup
  const [clickSound] = useState(() => {
    const audio = new Audio('/sounds/click-card.wav');
    audio.volume = 0.3; // Set volume to 30%
    audio.preload = 'auto';
    return audio;
  });
  
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
  

  const handlePointerDown = () => {
    setIsPressed(true);
    
    // Play click sound
    clickSound.currentTime = 0;
    clickSound.play().catch(() => {
      // Ignore audio play errors
    });
    
    // Haptic feedback on press
    if ('vibrate' in navigator) {
      try {
        // Try a pattern for better Android compatibility
        navigator.vibrate([50, 30, 50]);
      } catch (e) {
        // Ignore vibration errors
      }
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
    
    // Only handle swipes if onSwipe callback is provided
    if (onSwipe) {
      const SWIPE_VELOCITY_THRESHOLD = 500;
      
      // Check horizontal movement for swipe
      const shouldSwipe = Math.abs(info.offset.x) > SWIPE_THRESHOLD || 
                         Math.abs(info.velocity.x) > SWIPE_VELOCITY_THRESHOLD;
      
      if (shouldSwipe) {
        const direction = info.offset.x > 0 ? 'right' : 'left';
        setExitDirection(direction);
        onSwipe(direction);
      }
    }
  };

  // Handle keyboard swipe
  useEffect(() => {
    if (keyboardSwipe && isActive) {
      setExitDirection(keyboardSwipe);
      // Don't call onSwipe here - it will be called from CardDeck
    }
  }, [keyboardSwipe, isActive]);

  // Monitor x position for threshold feedback
  useEffect(() => {
    if (!isDragging) return;
    
    const unsubscribe = x.onChange((latest) => {
      const hitThreshold = Math.abs(latest) >= SWIPE_THRESHOLD;
      
      if (hitThreshold && !hasHitThreshold) {
        // Haptic feedback when crossing threshold
        if ('vibrate' in navigator) {
          // Stronger vibration for threshold crossing
          navigator.vibrate(100);
        }
        setHasHitThreshold(true);
      } else if (!hitThreshold && hasHitThreshold) {
        setHasHitThreshold(false);
      }
      
      // Update swipe direction
      if (latest !== 0) {
        setSwipeDirection(latest > 0 ? 'right' : 'left');
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
      x: exitDirection === 'right' ? window.innerWidth : -window.innerWidth,
      opacity: 0,
      scale: 0.8,
      rotate: exitDirection === 'right' ? 10 : -10,
      transition: {
        duration: keyboardSwipe ? 0.6 : 0.5,
        ease: 'easeOut',
      },
    },
  };

  // Calculate current scale based on state
  const currentScale = isPressed ? (hasHitThreshold ? 1.15 : 1.05) : 1;

  return (
    <motion.div
      className="card"
      drag={isActive && onSwipe ? true : false}
      dragSnapToOrigin={true}
      dragConstraints={false}
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
      }}
      onDragStart={handleDragStart}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <motion.div 
        className="card-inner"
        animate={{ 
          scale: currentScale,
          borderColor: hasHitThreshold && isDragging 
            ? (swipeDirection === 'right' ? 'var(--color-swipe-right)' : 'var(--color-swipe-left)')
            : 'var(--color-border)'
        }}
        transition={{
          scale: {
            type: "spring",
            stiffness: hasHitThreshold ? 700 : 400,
            damping: hasHitThreshold ? 15 : 25
          },
          borderColor: {
            duration: 0
          }
        }}
      >
        <motion.div
          animate={{ 
            filter: hasHitThreshold && isDragging ? 'blur(10px)' : 'blur(0px)' 
          }}
          transition={{ duration: 0.2 }}
          style={{ width: '100%', height: '100%' }}
        >
          {children}
        </motion.div>
        <AnimatePresence>
          {hasHitThreshold && isDragging && (
            <>
              <motion.div 
                className="threshold-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'var(--color-card-overlay)',
                  pointerEvents: 'none',
                  borderRadius: 'inherit',
                  zIndex: 10
                }}
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: swipeDirection === 'right' ? 'flex-start' : 'flex-end',
                  padding: '0 3rem',
                  pointerEvents: 'none',
                  zIndex: 11
                }}
              >
                <span
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    color: swipeDirection === 'right' ? 'var(--color-swipe-right)' : 'var(--color-swipe-left)',
                    opacity: 0.9,
                    letterSpacing: '-0.02em'
                  }}
                >
                  {swipeDirection === 'right' ? 'I like that' : 'Nah'}
                </span>
              </motion.div>
            </>
          )}
        </AnimatePresence>
        {isInCollection && isActive && (
          <>
            {/* Top right heart */}
            <div
              style={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
                fontSize: '1.5rem',
                color: 'var(--color-swipe-right)',
                zIndex: 12,
                pointerEvents: 'none'
              }}
            >
              ♥
            </div>
            {/* Bottom left heart (upside down) */}
            <div
              style={{
                position: 'absolute',
                bottom: '0.5rem',
                left: '0.5rem',
                fontSize: '1.5rem',
                color: 'var(--color-swipe-right)',
                transform: 'rotate(180deg)',
                zIndex: 12,
                pointerEvents: 'none'
              }}
            >
              ♥
            </div>
          </>
        )}
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