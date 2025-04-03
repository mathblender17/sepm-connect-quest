
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ConfettiProps {
  active: boolean;
}

export const Confetti = ({ active }: ConfettiProps) => {
  const [confetti, setConfetti] = useState<{ id: number; left: string; color: string; delay: string }[]>([]);
  
  useEffect(() => {
    if (active) {
      const colors = ["#f5d76e", "#2ecc71", "#3498db", "#9b59b6", "#e74c3c"];
      const newConfetti = [];
      
      for (let i = 0; i < 100; i++) {
        newConfetti.push({
          id: i,
          left: `${Math.random() * 100}%`,
          color: colors[Math.floor(Math.random() * colors.length)],
          delay: `${Math.random() * 3}s`
        });
      }
      
      setConfetti(newConfetti);
      
      // Remove confetti after animation
      const timer = setTimeout(() => {
        setConfetti([]);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [active]);
  
  if (!active) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute top-0 animate-confetti"
          style={{
            left: piece.left,
            width: "10px",
            height: "10px",
            backgroundColor: piece.color,
            animationDelay: piece.delay
          }}
        ></div>
      ))}
    </div>
  );
};
