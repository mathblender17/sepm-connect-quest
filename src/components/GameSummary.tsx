
import { Button } from "@/components/ui/button";
import { useGame } from "@/context/GameContext";
import { CategoryType } from "@/types/game";
import { Download, Trophy } from "lucide-react";

export const GameSummary = () => {
  const { gameData, isInstructor } = useGame();
  
  const winningTeam = gameData.teams.find(team => team.id === gameData.winningTeam);
  
  // Calculate game duration if both start and end times exist
  let duration = "Unknown";
  if (gameData.startTime && gameData.endTime) {
    const durationMs = gameData.endTime - gameData.startTime;
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    duration = `${minutes}m ${seconds}s`;
  }
  
  // Group the words by category
  const wordsByCategory: Record<CategoryType, string[]> = {
    yellow: [],
    green: [],
    blue: [],
    purple: []
  };
  
  gameData.words.forEach(word => {
    wordsByCategory[word.category].push(word.text);
  });
  
  const getCategoryName = (type: CategoryType) => {
    return gameData.categories.find(cat => cat.type === type)?.name || type;
  };
  
  const handleDownloadSummary = () => {
    // This would generate a CSV or PDF in a real implementation
    alert("In a real implementation, this would download a summary report.");
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Game Summary</h2>
        {winningTeam ? (
          <div className="flex flex-col items-center">
            <div className="bg-gameYellow/20 text-gameYellow border border-gameYellow px-4 py-2 rounded-full inline-flex items-center mb-2">
              <Trophy className="mr-2 h-5 w-5" /> 
              <span className="font-bold">{winningTeam.name} Wins!</span>
            </div>
            <p className="text-muted-foreground">
              Completion Time: {duration}
            </p>
          </div>
        ) : (
          <p className="text-muted-foreground">
            Game ended without a winner
          </p>
        )}
      </div>
      
      {/* Team Performance */}
      <div className="bg-card border rounded-lg p-6 mb-6">
        <h3 className="text-xl font-bold mb-4">Team Performance</h3>
        <div className="space-y-4">
          {gameData.teams.map(team => (
            <div key={team.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold">{team.name}</h4>
                <span className="font-medium">{team.score}/4 Categories Solved</span>
              </div>
              
              <p className="text-sm text-muted-foreground mb-2">
                Incorrect Attempts: {team.incorrectAttempts}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {team.solvedCategories.map(category => (
                  <span 
                    key={category}
                    className={`px-2 py-1 text-xs rounded bg-${category}/20 border border-${category}`}
                  >
                    {getCategoryName(category)}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Category Breakdown */}
      <div className="bg-card border rounded-lg p-6 mb-6">
        <h3 className="text-xl font-bold mb-4">Category Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(wordsByCategory).map(([category, words]) => {
            const typedCategory = category as CategoryType;
            return (
              <div 
                key={category} 
                className={`border rounded-lg p-4 bg-${typedCategory}/10 border-${typedCategory}`}
              >
                <h4 className="font-bold mb-2">{getCategoryName(typedCategory)}</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  {gameData.categories.find(cat => cat.type === typedCategory)?.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {words.map(word => (
                    <span key={word} className="px-2 py-1 text-sm rounded bg-background border">
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex justify-center space-x-4">
        {isInstructor && (
          <Button onClick={() => handleDownloadSummary()}>
            <Download className="mr-2 h-4 w-4" /> Download Summary
          </Button>
        )}
      </div>
    </div>
  );
};
