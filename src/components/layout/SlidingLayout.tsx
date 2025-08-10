import { motion } from 'framer-motion';
import { View } from '../navigation/TabBar';
import './SlidingLayout.css';

interface SlidingLayoutProps {
  currentView: View;
  children: [React.ReactNode, React.ReactNode]; // [discover, collection]
}

export function SlidingLayout({ currentView, children }: SlidingLayoutProps) {
  const xOffset = currentView === 'swipe' ? 0 : -100;
  
  return (
    <div className="sliding-container">
      <motion.div 
        className="sliding-content"
        animate={{ x: `${xOffset}vw` }}
        transition={{ 
          type: "spring",
          stiffness: 100,
          damping: 20,
          mass: 0.8
        }}
      >
        <div className="view-section discover-section">
          {children[0]}
        </div>
        <div className="view-section collection-section">
          {children[1]}
        </div>
      </motion.div>
    </div>
  );
}