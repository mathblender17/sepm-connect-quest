
import { useGame } from "@/context/GameContext";
import { cn } from "@/lib/utils";
import { Trophy } from "lucide-react";

export const Leaderboard = () => {
  const { gameData, currentPlayer } = useGame();

  // Sort players by score in descending order
  const sortedPlayers = [...gameData.players].sort((a, b) => b.score - a.score);

  if (sortedPlayers.length === 0) {
    return (
      <div className="w-full p-6 bg-card border rounded-lg shadow-sm text-center">
        <h2 className="text-xl font-bold mb-2 flex items-center justify-center">
          <Trophy className="mr-2 h-5 w-5 text-yellow-500" /> Leaderboard
        </h2>
        <p className="text-muted-foreground">No games played yet</p>
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-card border rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <Trophy className="mr-2 h-5 w-5 text-yellow-500" /> Leaderboard
      </h2>

      <div className="space-y-3">
        {sortedPlayers.map((player) => {
          const isCurrentPlayer = currentPlayer === player.name;
          
          return (
            <div 
              key={player.name}
              className={cn(
                "p-3 border rounded flex justify-between items-center transition-all",
                isCurrentPlayer && "border-primary bg-primary/5"
              )}
            >
              <div className="flex items-center">
                <span className="font-medium">{player.name}</span>
                {isCurrentPlayer && (
                  <span className="ml-2 text-xs px-1.5 py-0.5 bg-primary/20 rounded">You</span>
                )}
              </div>
              
              <div className="flex items-center">
                <div className="flex space-x-1 mr-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div 
                      key={i}
                      className={cn(
                        "w-3 h-3 rounded-full",
                        i < player.solvedCategories.length
                          ? "bg-green-500"
                          : "bg-muted"
                      )}
                    />
                  ))}
                </div>
                <span className="font-bold">{player.score}/4</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
