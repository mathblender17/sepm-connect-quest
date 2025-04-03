
import { Button } from "@/components/ui/button";
import { useGame } from "@/context/GameContext";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export const GameLobby = () => {
  const { gameData, isInstructor, currentTeam, dispatch } = useGame();

  const handleTeamReady = () => {
    if (currentTeam) {
      dispatch({
        type: "SET_TEAM_READY",
        payload: { teamId: currentTeam.id, isReady: true }
      });
    }
  };

  const allTeamsReady = gameData.teams.every(team => team.isReady);

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
                {team.isReady ? (
                  <span className="text-xs px-2 py-0.5 bg-gameGreen/20 text-gameGreen flex items-center rounded">
                    <Check className="mr-1 h-3 w-3" /> Ready
                  </span>
                ) : (
                  <span className="text-xs px-2 py-0.5 bg-muted rounded">Not Ready</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {!isInstructor && currentTeam && !currentTeam.isReady && (
        <div className="text-center">
          <Button onClick={handleTeamReady} className="w-full">
            I'm Ready to Play
          </Button>
        </div>
      )}
      
      {isInstructor && (
        <div className="text-center">
          <Button 
            onClick={() => dispatch({ type: "START_GAME" })}
            disabled={!allTeamsReady} 
            className="w-full"
          >
            Start Game
          </Button>
          {!allTeamsReady && (
            <p className="mt-2 text-sm text-muted-foreground">
              Waiting for all teams to be ready...
            </p>
          )}
        </div>
      )}
    </div>
  );
};
