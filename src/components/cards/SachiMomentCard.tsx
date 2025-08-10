import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { SachiMomentCard as SachiMomentCardType } from '../../types';
import './SachiMomentCard.css';

interface SachiMomentCardProps {
  card: SachiMomentCardType;
}

export function SachiMomentCard({ card }: SachiMomentCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.muted = true;
        setIsPlaying(false);
      } else {
        videoRef.current.currentTime = 0;
        videoRef.current.muted = false;
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  return (
    <div className="sachi-moment-card" onClick={isPlaying ? handlePlayPause : undefined}>
      <motion.div
        className="sachi-video-container"
        animate={{
          x: !isPlaying ? [0, -15, 0, 15, 0] : 0,
          y: !isPlaying ? [0, -15, 15, -15, 0] : 0,
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <video 
          ref={videoRef}
          className="sachi-video"
          src={card.video}
          autoPlay
          loop
          muted
          playsInline
          onEnded={handleVideoEnd}
        />
      </motion.div>
      
      {!isPlaying && (
        <div className="sachi-info-overlay">
          <button 
            className="sachi-play-button"
            onClick={handlePlayPause}
            aria-label="Play video"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 3l14 9-14 9V3z" fill="currentColor" />
            </svg>
          </button>
          
          <div className="sachi-content">
            <h3 className="sachi-title">{card.title}</h3>
            <div className="sachi-duration">{card.duration}</div>
          </div>
        </div>
      )}
    </div>
  );
}