
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
  const { gameData, isInstructor, dispatch } = useGame();

  const handleStartGame = () => {
    dispatch({ type: "START_GAME" });
  };

  const handleEndGame = () => {
    dispatch({ type: "END_GAME" });
  };

  const handleShowAnswers = () => {
    dispatch({ type: "SHOW_ANSWERS" });
  };

  const handleResetGame = () => {
    dispatch({ type: "RESET_GAME" });
  };

  const allTeamsReady = gameData.teams.every((team) => team.isReady);

  return (
    <header className="w-full py-4 flex justify-between items-center border-b">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-primary mr-2">SEPM Connections</h1>
        <span className="text-sm px-2 py-0.5 bg-muted rounded">
          Game Code: {gameData.code}
        </span>
      </div>

      <div className="flex items-center space-x-2">
        {isInstructor && gameData.state === "lobby" && (
          <Button
            onClick={handleStartGame}
            disabled={!allTeamsReady}
            className="animate-pulse-subtle"
          >
            Start Game
          </Button>
        )}

        {isInstructor && gameData.state === "playing" && (
          <Button variant="destructive" onClick={handleEndGame}>
            End Game
          </Button>
        )}

        {isInstructor && gameData.state === "ended" && (
          <Button onClick={handleResetGame}>New Game</Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {isInstructor && (
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
