
import { Button } from "@/components/ui/button";
import { useGame } from "@/context/GameContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Info } from "lucide-react";

export const Header = () => {
  const { gameData, dispatch } = useGame();

  const handleEndGame = () => {
    dispatch({ type: "END_GAME" });
  };

  const handleShowAnswers = () => {
    dispatch({ type: "SHOW_ANSWERS" });
  };

  const handleResetGame = () => {
    dispatch({ type: "RESET_GAME" });
  };

  return (
    <header className="w-full py-4 flex justify-between items-center border-b">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-primary mr-2">SEPM Connections</h1>
      </div>

      <div className="flex items-center space-x-2">
        {gameData.state === "playing" && (
          <Button variant="outline" onClick={handleEndGame}>
            End Game
          </Button>
        )}

        {gameData.state === "ended" && (
          <Button onClick={handleResetGame}>New Game</Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {gameData.state === "ended" && (
              <DropdownMenuItem onClick={handleShowAnswers}>
                Show Answers
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => {}}>
              <Info className="mr-2 h-4 w-4" /> How to Play
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
