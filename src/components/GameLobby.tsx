
import { Button } from "@/components/ui/button";
import { useGame } from "@/context/GameContext";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export const GameLobby = () => {
  const { gameData, isInstructor, currentTeam, dispatch } = useGame();

  // Removed the handleTeamReady function since we're simplifying the multiplayer aspect

  return (
    <div className="w-full max-w-lg mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Welcome to SEPM Connections</h2>
        <p className="text-muted-foreground">
          Teams must group 16 words into 4 categories related to Software Engineering & Product Management
        </p>
      </div>
      
      <div className="bg-card border rounded-lg p-6 mb-6">
        <h3 className="text-xl font-bold mb-4">Game Lobby</h3>
        <p className="mb-2 text-sm text-muted-foreground">Game Code: <span className="font-medium text-foreground">{gameData.code}</span></p>
        
        <div className="mt-4">
          <h4 className="font-medium mb-2">Teams</h4>
          <div className="space-y-2">
            {gameData.teams.map(team => (
              <div 
                key={team.id} 
                className={cn(
                  "p-3 border rounded flex justify-between items-center",
                  team.id === currentTeam?.id && "border-primary bg-primary/5",
                )}
              >
                <span className="font-medium">{team.name}</span>
                {/* Removed ready status indicators since we're simplifying */}
                <span className="text-xs px-2 py-0.5 bg-muted rounded">
                  {isInstructor ? "Waiting for start" : "Ready to play"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {isInstructor && (
        <div className="text-center">
          <Button 
            onClick={() => dispatch({ type: "START_GAME" })}
            className="w-full"
          >
            Start Game
          </Button>
          <p className="mt-2 text-sm text-muted-foreground">
            Click to start the game for all teams
          </p>
        </div>
      )}
      
      {!isInstructor && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground p-4 bg-muted rounded-lg">
            Waiting for the instructor to start the game...
          </p>
        </div>
      )}
    </div>
  );
};
