
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { CategoryType, GameData, GameState, Team, Word } from '../types/game';
import { createMockGame } from '../data/mockData';
import { toast } from '@/components/ui/use-toast';

interface GameContextType {
  gameData: GameData;
  selectedWords: Word[];
  timeRemaining: number | null;
  dispatch: React.Dispatch<GameAction>;
}

type GameAction =
  | { type: 'SET_GAME_STATE'; payload: GameState }
  | { type: 'TOGGLE_WORD_SELECTION'; payload: string }
  | { type: 'SUBMIT_SELECTION' }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'START_GAME' }
  | { type: 'END_GAME'; payload?: string }
  | { type: 'SHOW_ANSWERS' }
  | { type: 'RESET_GAME' }
  | { type: 'TICK_TIMER' };

const GameContext = createContext<GameContextType | undefined>(undefined);

// Game timer constants
const GAME_DURATION = 270; // 4:30 in seconds (270 seconds)

const gameReducer = (state: GameData, action: GameAction): GameData => {
  switch (action.type) {
    case 'SET_GAME_STATE': {
      return { ...state, state: action.payload };
    }
    
    case 'TOGGLE_WORD_SELECTION': {
      const wordId = action.payload;
      
      // If the game is not in progress, do nothing
      if (state.state !== 'playing') {
        return state;
      }
      
      // If the player is locked out from too many incorrect attempts, do nothing
      if (state.incorrectAttempts >= state.settings.maxIncorrectAttempts) {
        return state;
      }
      
      // If the word is already solved, do nothing
      const word = state.words.find(w => w.id === wordId);
      if (!word || word.solved) {
        return state;
      }

      const updatedWords = state.words.map(word => {
        if (word.id === wordId) {
          return { ...word, selected: !word.selected };
        }
        return word;
      });

      return { ...state, words: updatedWords };
    }
    
    case 'SUBMIT_SELECTION': {
      // If the game is not in progress, do nothing
      if (state.state !== 'playing') {
        return state;
      }
      
      // If player is locked out, do nothing
      if (state.incorrectAttempts >= state.settings.maxIncorrectAttempts) {
        return state;
      }
      
      // Get all selected words
      const selectedWords = state.words.filter(word => word.selected);
      
      // If there aren't exactly 4 selected words, do nothing
      if (selectedWords.length !== 4) {
        toast({
          title: "Invalid Selection",
          description: "Please select exactly 4 words to submit a group.",
          variant: "destructive"
        });
        return state;
      }
      
      // Check if all selected words belong to the same category
      const categories = selectedWords.map(word => word.category);
      const allSameCategory = categories.every(cat => cat === categories[0]);
      
      if (allSameCategory) {
        // Successful submission!
        const category = categories[0];
        
        // Update the words as solved
        const updatedWords = state.words.map(word => {
          if (selectedWords.some(sw => sw.id === word.id)) {
            return { ...word, selected: false, solved: true };
          }
          return word;
        });
        
        // Update the category as solved
        const updatedCategories = state.categories.map(cat => {
          if (cat.type === category) {
            return { ...cat, solved: true };
          }
          return cat;
        });
        
        // Update the score
        const updatedScore = state.score + 1;
        const updatedSolvedCategories = [...state.solvedCategories, category];
        
        // Check if all categories are solved (game won)
        let gameState = state.state;
        let endTime = state.endTime;
        
        if (updatedSolvedCategories.length === 4) {
          gameState = 'ended';
          endTime = Date.now();
          toast({
            title: "You Win!",
            description: "Congratulations! You've found all categories!",
          });
        } else {
          toast({
            title: "Correct!",
            description: `You've found the ${updatedCategories.find(c => c.type === category)?.name} category!`,
          });
        }
        
        return {
          ...state,
          words: updatedWords,
          categories: updatedCategories,
          score: updatedScore,
          solvedCategories: updatedSolvedCategories,
          state: gameState,
          endTime
        };
      } else {
        // Incorrect submission
        // Clear the selection
        const updatedWords = state.words.map(word => {
          if (word.selected) {
            return { ...word, selected: false };
          }
          return word;
        });
        
        // Increment incorrect attempts
        const newIncorrectAttempts = state.incorrectAttempts + 1;
        const isLocked = newIncorrectAttempts >= state.settings.maxIncorrectAttempts;
        
        let gameState = state.state;
        let endTime = state.endTime;
        
        if (isLocked) {
          gameState = 'ended';
          endTime = Date.now();
          toast({
            title: "Game Over!",
            description: "Too many incorrect attempts.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Incorrect!",
            description: `Try again! ${state.settings.maxIncorrectAttempts - newIncorrectAttempts} attempts remaining.`,
            variant: "destructive"
          });
        }
        
        return { 
          ...state, 
          words: updatedWords, 
          incorrectAttempts: newIncorrectAttempts,
          state: gameState,
          endTime
        };
      }
    }
    
    case 'CLEAR_SELECTION': {
      const updatedWords = state.words.map(word => {
        if (word.selected && !word.solved) {
          return { ...word, selected: false };
        }
        return word;
      });
      
      return { ...state, words: updatedWords };
    }
    
    case 'START_GAME': {
      return {
        ...state,
        state: 'playing',
        startTime: Date.now(),
        timeRemaining: GAME_DURATION
      };
    }
    
    case 'END_GAME': {
      return {
        ...state,
        state: 'ended',
        endTime: Date.now()
      };
    }
    
    case 'TICK_TIMER': {
      if (state.state !== 'playing' || state.timeRemaining === null) {
        return state;
      }
      
      const newTimeRemaining = Math.max(0, state.timeRemaining - 1);
      
      // If timer reaches 0, end the game
      if (newTimeRemaining === 0) {
        return {
          ...state,
          timeRemaining: 0,
          state: 'ended',
          endTime: Date.now()
        };
      }
      
      return {
        ...state,
        timeRemaining: newTimeRemaining
      };
    }
    
    case 'SHOW_ANSWERS': {
      // Mark all categories as solved
      const updatedCategories = state.categories.map(category => {
        return { ...category, solved: true };
      });
      
      // Mark all words as solved
      const updatedWords = state.words.map(word => {
        return { ...word, selected: false, solved: true };
      });
      
      return {
        ...state,
        categories: updatedCategories,
        words: updatedWords
      };
    }
    
    case 'RESET_GAME': {
      return createMockGame();
    }
    
    default:
      return state;
  }
};

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameData, dispatch] = useReducer(gameReducer, createMockGame());
  const selectedWords = gameData.words.filter(word => word.selected);
  const timeRemaining = gameData.timeRemaining;
  
  // Setup game timer
  useEffect(() => {
    let timerInterval: number | undefined;
    
    if (gameData.state === 'playing' && gameData.timeRemaining !== null && gameData.timeRemaining > 0) {
      timerInterval = window.setInterval(() => {
        dispatch({ type: 'TICK_TIMER' });
      }, 1000);
    }
    
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [gameData.state, gameData.timeRemaining]);
  
  return (
    <GameContext.Provider
      value={{
        gameData,
        selectedWords,
        timeRemaining,
        dispatch
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
