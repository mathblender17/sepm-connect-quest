
import { useState, useEffect } from "react";
import { GameProvider, useGame } from "@/context/GameContext";
import { Header } from "@/components/Header";
import { GameBoard } from "@/components/GameBoard";
import { Leaderboard } from "@/components/Leaderboard";
import { GameLobby } from "@/components/GameLobby";
import { GameSummary } from "@/components/GameSummary";
import { RoleSelection } from "@/components/RoleSelection";
import { Confetti } from "@/components/Confetti";

const GameContent = () => {
  const { gameData } = useGame();
  const [showConfetti, setShowConfetti] = useState(false);
  
  useEffect(() => {
    // Show confetti when a winner is declared and the game has just ended
    if (gameData.winningTeam && gameData.state === 'ended') {
      setShowConfetti(true);
      
      // Hide confetti after a few seconds
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [gameData.winningTeam, gameData.state]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 p-4 md:p-6">
        {gameData.state === 'lobby' && <GameLobby />}
        
        {gameData.state === 'playing' && (
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1 order-2 md:order-1">
              <GameBoard />
            </div>
            <div className="w-full md:w-80 order-1 md:order-2">
              <Leaderboard />
            </div>
          </div>
        )}
        
        {gameData.state === 'ended' && <GameSummary />}
        
        <Confetti active={showConfetti} />
      </main>
    </div>
  );
};

const Index = () => {
  const [hasRole, setHasRole] = useState(false);
  
  const handleRoleSelected = () => {
    setHasRole(true);
  };
  
  return (
    <div className="min-h-screen bg-background">
      {hasRole ? (
        <GameProvider>
          <GameContent />
        </GameProvider>
      ) : (
        <RoleSelection onRoleSelected={handleRoleSelected} />
      )}
    </div>
  );
};

export default Index;
