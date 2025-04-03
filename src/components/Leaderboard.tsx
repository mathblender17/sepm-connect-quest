
import { useGame } from "@/context/GameContext";
import { cn } from "@/lib/utils";
import { Trophy } from "lucide-react";

export const Leaderboard = () => {
  const { gameData, currentTeam } = useGame();

  // Sort teams by score in descending order
  const sortedTeams = [...gameData.teams].sort((a, b) => b.score - a.score);

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-card border rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <Trophy className="mr-2 h-5 w-5 text-gameYellow" /> Leaderboard
      </h2>

      <div className="space-y-3">
        {sortedTeams.map((team) => {
          const isCurrentTeam = currentTeam?.id === team.id;
          const isWinner = gameData.winningTeam === team.id;
          const isOneAway = team.solvedCategories.length === 3 && gameData.state === "playing";
          
          return (
            <div 
              key={team.id}
              className={cn(
                "p-3 border rounded flex justify-between items-center transition-all",
                isCurrentTeam && "border-primary bg-primary/5",
                isOneAway && "animate-pulse-subtle",
                isWinner && "border-gameYellow bg-gameYellow/10"
              )}
            >
              <div className="flex items-center">
                <span className="font-medium">{team.name}</span>
                {isCurrentTeam && (
                  <span className="ml-2 text-xs px-1.5 py-0.5 bg-primary/20 rounded">You</span>
                )}
                {isWinner && (
                  <span className="ml-2 text-xs px-1.5 py-0.5 bg-gameYellow/20 text-gameYellow border border-gameYellow rounded flex items-center">
                    <Trophy className="mr-1 h-3 w-3" /> Winner
                  </span>
                )}
              </div>
              
              <div className="flex items-center">
                <div className="flex space-x-1 mr-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div 
                      key={i}
                      className={cn(
                        "w-3 h-3 rounded-full",
                        i < team.solvedCategories.length
                          ? "bg-gameGreen"
                          : "bg-muted"
                      )}
                    />
                  ))}
                </div>
                <span className="font-bold">{team.score}/4</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
