import React from "react";
import "./Card.css";

export interface CardItem {
  id: string;
  image: string;
  title: string;
}

interface CardGridProps {
  cards: CardItem[];
  cardsPerColumn?: number;
  height?: string;
  onCardClick?: (el: any) => void;
}

export const CardGrid: React.FC<CardGridProps> = ({
  cards,
  cardsPerColumn,
  height,
  onCardClick,
}) => {
  return (
    <div
      className="card-grid-container"
      style={
        {
          "--cards-per-column": cardsPerColumn,
          height: height || "100%",
        } as React.CSSProperties
      }
    >
      {cards.map((card, index) => (
        <div
          key={`${card.title}-${index}`}
          className="card-item"
          onClick={() => onCardClick?.(card)}
        >
          <div className="image-wrapper">
            <img src={card.image} alt={card.title} className="card-image" />
          </div>
          <span className="card-title">{card.title}</span>
        </div>
      ))}
    </div>
  );
};
