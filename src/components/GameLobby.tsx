
import { Button } from "@/components/ui/button";
import { useGame } from "@/context/GameContext";

export const GameLobby = () => {
  const { dispatch } = useGame();

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
      
      <div className="text-center">
        <Button 
          onClick={() => dispatch({ type: "START_GAME" })}
          className="w-full"
        >
          Start Game
        </Button>
      </div>
    </div>
  );
};
