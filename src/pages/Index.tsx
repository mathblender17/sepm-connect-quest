
import { useState } from "react";
import { GameProvider, useGame } from "@/context/GameContext";
import { Header } from "@/components/Header";
import { GameBoard } from "@/components/GameBoard";
import { GameLobby } from "@/components/GameLobby";
import { GameSummary } from "@/components/GameSummary";
import { Confetti } from "@/components/Confetti";

const GameContent = () => {
  const { gameData } = useGame();
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Show confetti when the player wins
  useState(() => {
    if (gameData.state === 'ended' && gameData.solvedCategories.length === 4) {
      setShowConfetti(true);
      
      // Hide confetti after a few seconds
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 p-4 md:p-6">
        {gameData.state === 'lobby' && <GameLobby />}
        
        {gameData.state === 'playing' && <GameBoard />}
        
        {gameData.state === 'ended' && <GameSummary />}
        
        <Confetti active={showConfetti} />
      </main>
    </div>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <GameProvider>
        <GameContent />
      </GameProvider>
    </div>
  );
};

export default Index;
