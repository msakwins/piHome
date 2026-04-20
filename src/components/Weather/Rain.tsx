import { useMemo, type CSSProperties } from "react";
import styled from "styled-components";

interface Droplet {
  id: number;
  x: number;
  delay: number;
  duration: number;
  opacity: number;
  scale: number;
}

const dropletCount = 180;

type RainDropStyle = CSSProperties & {
  "--scale": number;
};

const RainContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 1;
  border-radius: 24px;
`;

const RainDrop = styled.svg`
  position: absolute;
  width: 2px;
  height: 30px;
  top: -50px;
  animation: fall linear infinite;
  transform-origin: top center;
  transform: scale(var(--scale, 1));

  @keyframes fall {
    from {
      transform: translateY(0) scale(var(--scale, 1));
    }

    to {
      transform: translateY(calc(100% + 100px)) scale(var(--scale, 1));
    }
  }
`;

export const Rain = () => {
  const droplets = useMemo<Droplet[]>(() => {
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
    <RainContainer>
      {droplets.map((drop) => (
        <RainDrop
          key={drop.id}
          viewBox="0 0 5 50"
          style={{
            left: `${drop.x}%`,
            animationDelay: `${drop.delay}s`,
            animationDuration: `${drop.duration}s`,
            opacity: drop.opacity,
            "--scale": drop.scale,
          } as RainDropStyle}
        >
          <path
            d="M 2.5,0 C 2.6,3.5 3.3,20.5 4.4,30.9 5.7,42.6 4.5,50 2.5,50 0.4,50 -0.7,42.6 0.5,30.9 1.6,20.5 2.3,3.5 2.5,0 Z"
            fill="white"
          />
        </RainDrop>
      ))}
    </RainContainer>
  );
};
