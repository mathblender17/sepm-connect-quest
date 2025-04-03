
import { Button } from "@/components/ui/button";
import { useGame } from "@/context/GameContext";
import { CategoryType } from "@/types/game";
import { Download, Trophy, Clock, X, Check } from "lucide-react";

export const GameSummary = () => {
  const { gameData, dispatch } = useGame();
  
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
  
  const handleNewGame = () => {
    dispatch({ type: 'RESET_GAME' });
  };
  
  const handleShowAnswers = () => {
    dispatch({ type: 'SHOW_ANSWERS' });
  };
  
  // Determine game outcome
  const isWin = gameData.solvedCategories.length === 4;
  const isTimedOut = gameData.timeRemaining === 0;
  const isGameOver = gameData.incorrectAttempts >= gameData.settings.maxIncorrectAttempts;
  
  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Game Summary</h2>
        
        {isWin && (
          <div className="flex flex-col items-center">
            <div className="bg-gameGreen/20 text-gameGreen border border-gameGreen px-4 py-2 rounded-full inline-flex items-center mb-2">
              <Trophy className="mr-2 h-5 w-5" /> 
              <span className="font-bold">You Win!</span>
            </div>
            <p className="text-muted-foreground">
              Completion Time: {duration}
            </p>
          </div>
        )}
        
        {isTimedOut && (
          <div className="flex flex-col items-center">
            <div className="bg-amber-500/20 text-amber-500 border border-amber-500 px-4 py-2 rounded-full inline-flex items-center mb-2">
              <Clock className="mr-2 h-5 w-5" /> 
              <span className="font-bold">Time's Up!</span>
            </div>
            <p className="text-muted-foreground">
              Solved {gameData.score} out of 4 categories
            </p>
          </div>
        )}
        
        {isGameOver && (
          <div className="flex flex-col items-center">
            <div className="bg-gameRed/20 text-gameRed border border-gameRed px-4 py-2 rounded-full inline-flex items-center mb-2">
              <X className="mr-2 h-5 w-5" /> 
              <span className="font-bold">Game Over!</span>
            </div>
            <p className="text-muted-foreground">
              Too many incorrect attempts
            </p>
          </div>
        )}
      </div>
      
      {/* Performance Summary */}
      <div className="bg-card border rounded-lg p-6 mb-6">
        <h3 className="text-xl font-bold mb-4">Performance</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Categories Solved:</span>
            <span className="font-medium">{gameData.score}/4</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Incorrect Attempts:</span>
            <span className="font-medium">{gameData.incorrectAttempts}/{gameData.settings.maxIncorrectAttempts}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Time Used:</span>
            <span className="font-medium">{duration}</span>
          </div>
          
          <div className="mt-4">
            <h4 className="font-medium mb-2">Solved Categories:</h4>
            <div className="flex flex-wrap gap-2">
              {gameData.solvedCategories.map(category => (
                <span 
                  key={category}
                  className={`px-2 py-1 text-xs rounded bg-${category}/20 border border-${category}`}
                >
                  {getCategoryName(category)}
                </span>
              ))}
              {gameData.solvedCategories.length === 0 && (
                <span className="text-muted-foreground">No categories solved</span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Category Breakdown */}
      <div className="bg-card border rounded-lg p-6 mb-6">
        <h3 className="text-xl font-bold mb-4">Category Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(wordsByCategory).map(([category, words]) => {
            const typedCategory = category as CategoryType;
            const isSolved = gameData.solvedCategories.includes(typedCategory);
            return (
              <div 
                key={category} 
                className={cn(
                  "border rounded-lg p-4",
                  isSolved ? `bg-${typedCategory}/10 border-${typedCategory}` : "bg-muted/50"
                )}
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold">{getCategoryName(typedCategory)}</h4>
                  {isSolved && <Check className="h-4 w-4 text-green-600" />}
                </div>
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
        <Button onClick={handleNewGame}>
          Play Again
        </Button>
        
        {!isWin && (
          <Button variant="outline" onClick={handleShowAnswers}>
            Show All Answers
          </Button>
        )}
      </div>
    </div>
  );
};

// Helper function for conditional classes
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};
