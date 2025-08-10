import { PhilosophyCard as PhilosophyCardType } from '../../types';
import './PhilosophyCard.css';

interface PhilosophyCardProps {
  card: PhilosophyCardType;
}

export function PhilosophyCard({ card }: PhilosophyCardProps) {
  return (
    <div className="philosophy-card">
      <div className="philosophy-background" />
      <div className="philosophy-content">
        <p className="philosophy-statement">{card.statement}</p>
      </div>
    </div>
  );
}