
import { useGame } from "@/context/GameContext";
import { cn } from "@/lib/utils";
import { Timer as TimerIcon } from "lucide-react";

export const Timer = () => {
  const { timeRemaining } = useGame();
  
  if (timeRemaining === null) {
    return null;
  }
  
  // Format time as MM:SS
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  
  // Time is low when less than 30 seconds remain
  const isTimeLow = timeRemaining <= 30;
  
  return (
    <div className={cn(
      "flex items-center justify-center gap-2 text-xl font-bold p-2 rounded-md transition-colors",
      isTimeLow ? "text-red-600 animate-pulse" : "text-foreground"
    )}>
      <TimerIcon className="w-5 h-5" />
      <span>{formattedTime}</span>
    </div>
  );
};
