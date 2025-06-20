import { useState } from 'react';
import './Bubbles.css';

const Bubbles = () => {
  const [bubbles] = useState(() => 
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      size: Math.random() * 20 + 20,
      left: Math.random() * 100, // Percentage for horizontal positioning
      speed: Math.random() * 0.5 + 0.3,
      bottom: Math.random() * 100, // Percentage for vertical starting position
      opacity: Math.random() * 0.5 + 0.3
    }))
  );

  return (
    <div className="bubbles-container">
      {bubbles.map(bubble => (
        <div
          key={bubble.id}
          className="bubble"
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: `${bubble.left}%`,
            bottom: `${bubble.bottom}%`, // Changed from px to %
            opacity: bubble.opacity,
            animation: `floatUp ${10 / bubble.speed}s linear infinite`,
            animationDelay: `${Math.random() * 2}s`
          }}
        >
         <img src="/bubbles.svg" width="100%" height="100%" alt="" className="" />
        </div>
      ))}
    </div>
  );
};

export default Bubbles;