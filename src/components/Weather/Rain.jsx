import React from "react"
import { useMemo } from "react";

const dropletCount = 180;

export const Rain = () => {
  const droplets = useMemo(() => {
    return Array.from({ length: dropletCount }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,      // Horizontal position (%)
      delay: Math.random() * -20,  // Random start time (negative so it's already falling)
      duration: Math.random() * 1 + 2.8, // Speed of fall
      opacity: Math.random() * 0.3 + 0.1, // Light transparency
      scale: Math.random() * 0.5 + 0.5,
    }));
  }, []);
  return (

      
      <div className="rain-container">
      {droplets.map((drop) => (
          <svg
          key={drop.id}
          className="rain__drop"
          viewBox="0 0 5 50"
          style={{
              left: `${drop.x}%`,
              animationDelay: `${drop.delay}s`,
              animationDuration: `${drop.duration}s`,
              opacity: drop.opacity,
              transform: `scale(${drop.scale})`,
            }}
        >
          <path
            d="M 2.5,0 C 2.6,3.5 3.3,20.5 4.4,30.9 5.7,42.6 4.5,50 2.5,50 0.4,50 -0.7,42.6 0.5,30.9 1.6,20.5 2.3,3.5 2.5,0 Z"
            fill="white"
          />
        </svg>
      ))}
    </div>

)}