
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGame } from "@/context/GameContext";
import { useState } from "react";
import { Leaderboard } from "./Leaderboard";

export const GameLobby = () => {
  const { dispatch, currentPlayer } = useGame();
  const [playerName, setPlayerName] = useState(currentPlayer || "");

  const handleStartGame = () => {
    if (playerName.trim()) {
      dispatch({ type: "SET_PLAYER_NAME", payload: playerName.trim() });
      dispatch({ type: "START_GAME" });
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Welcome to SEPM Connections</h2>
        <p className="text-muted-foreground">
          Group 16 words into 4 categories related to Software Engineering & Product Management
        </p>
      </div>
      
      <div className="bg-card border rounded-lg p-6 mb-6">
        <h3 className="text-xl font-bold mb-4">Game Rules</h3>
        <ul className="space-y-2 list-disc pl-5">
          <li>Find 4 groups of 4 related words</li>
          <li>Select exactly 4 words to submit a group</li>
          <li>You have 4 minutes and 30 seconds to solve all groups</li>
          <li>Maximum 4 incorrect attempts allowed</li>
        </ul>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="player-name">Your Name</Label>
          <Input 
            id="player-name" 
            placeholder="Enter your name" 
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
        </div>
        
        <Button 
          onClick={handleStartGame}
          className="w-full"
          disabled={!playerName.trim()}
        >
          Start Game
        </Button>
      </div>
      
      <div className="mt-8">
        <Leaderboard />
      </div>
    </div>
  );
};
