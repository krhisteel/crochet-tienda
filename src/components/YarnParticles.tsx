"use client";

import { useEffect, useState } from "react";

interface Particle {
  id: number;
  size: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
  colorLight: string;
  opacity: number;
}

const yarnColors = [
  { color: "#D4849A", colorLight: "#E8A5BA" },
  { color: "#E8C9A0", colorLight: "#F2DDC4" },
  { color: "#C9A0D4", colorLight: "#DFC4E8" },
  { color: "#A0C9D4", colorLight: "#C4DFE8" },
  { color: "#D4A0A0", colorLight: "#E8C4C4" },
  { color: "#A0D4B8", colorLight: "#C4E8D4" },
  { color: "#D4C4A0", colorLight: "#E8DEC4" },
];

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function YarnParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const count = 18;
    const newParticles: Particle[] = Array.from({ length: count }, (_, i) => {
      const colorSet = yarnColors[Math.floor(Math.random() * yarnColors.length)];
      return {
        id: i,
        size: randomBetween(8, 28),
        left: randomBetween(0, 100),
        delay: randomBetween(0, 20),
        duration: randomBetween(15, 30),
        color: colorSet.color,
        colorLight: colorSet.colorLight,
        opacity: randomBetween(0.15, 0.4),
      };
    });
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="yarn-particle"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            "--yarn-color": p.color,
            "--yarn-color-light": p.colorLight,
            "--yarn-opacity": p.opacity,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
