
import { Button } from "@/components/ui/button";
import { useGame } from "@/context/GameContext";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

export const GameBoard = () => {
  const { gameData, currentTeam, selectedWords, dispatch } = useGame();

  const handleWordClick = (wordId: string) => {
    dispatch({ type: "TOGGLE_WORD_SELECTION", payload: wordId });
  };

  const handleSubmit = () => {
    dispatch({ type: "SUBMIT_SELECTION" });
  };

  const handleClearSelection = () => {
    dispatch({ type: "CLEAR_SELECTION" });
  };

  // Flag to determine if the current team can interact with the board
  const canInteract = 
    gameData.state === "playing" && 
    currentTeam && 
    !currentTeam.isLocked;

  // Flag to disable submit button
  const canSubmit = selectedWords.length === 4 && canInteract;

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <div className="grid grid-cols-4 gap-4">
        {gameData.words.map((word) => (
          <div
            key={word.id}
            className={cn(
              "game-card h-24",
              word.solved && word.category,
              word.selected && !word.solved && "selected",
              !canInteract && "cursor-not-allowed opacity-70"
            )}
            onClick={() => canInteract && !word.solved && handleWordClick(word.id)}
          >
            <span className="text-lg">{word.text}</span>
            {word.solved && (
              <div className="absolute top-1 right-1">
                <Check className="h-4 w-4 text-green-600" />
              </div>
            )}
          </div>
        ))}
      </div>

      {gameData.state === "playing" && currentTeam && (
        <div className="mt-6 flex justify-center space-x-4">
          {selectedWords.length > 0 && (
            <Button
              variant="outline"
              onClick={handleClearSelection}
              disabled={!canInteract}
            >
              <X className="mr-1 h-4 w-4" /> Clear Selection
            </Button>
          )}
          
          <Button 
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={cn(
              canSubmit && "animate-pulse-subtle"
            )}
          >
            <Check className="mr-1 h-4 w-4" /> Submit Group
          </Button>
        </div>
      )}

      {currentTeam?.isLocked && (
        <div className="mt-6 p-4 bg-gameRed/10 border border-gameRed rounded-lg text-center">
          <h3 className="text-lg font-medium text-gameRed">Your team is locked out!</h3>
          <p>You've reached the maximum number of incorrect attempts.</p>
        </div>
      )}
    </div>
  );
};
