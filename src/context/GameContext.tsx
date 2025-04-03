
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { CategoryType, GameData, GameState, Team, Word } from '../types/game';
import { createMockGame } from '../data/mockData';
import { toast } from '@/components/ui/use-toast';

interface GameContextType {
  gameData: GameData;
  isInstructor: boolean;
  currentTeam: Team | null;
  selectedWords: Word[];
  dispatch: React.Dispatch<GameAction>;
}

type GameAction =
  | { type: 'SET_GAME_STATE'; payload: GameState }
  | { type: 'SET_CURRENT_TEAM'; payload: string }
  | { type: 'TOGGLE_WORD_SELECTION'; payload: string }
  | { type: 'SUBMIT_SELECTION' }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'SET_TEAM_READY'; payload: { teamId: string; isReady: boolean } }
  | { type: 'START_GAME' }
  | { type: 'END_GAME'; payload?: string }
  | { type: 'SHOW_ANSWERS' }
  | { type: 'RESET_GAME' };

const GameContext = createContext<GameContextType | undefined>(undefined);

const gameReducer = (state: GameData, action: GameAction): GameData => {
  switch (action.type) {
    case 'SET_GAME_STATE': {
      return { ...state, state: action.payload };
    }
    
    case 'TOGGLE_WORD_SELECTION': {
      const wordId = action.payload;
      const currentTeamId = localStorage.getItem('currentTeam');
      
      // If no team is selected or the game is not in progress, do nothing
      if (!currentTeamId || state.state !== 'playing') {
        return state;
      }
      
      const team = state.teams.find(t => t.id === currentTeamId);
      
      // If team is locked out from too many incorrect attempts, do nothing
      if (!team || team.isLocked) {
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
      const currentTeamId = localStorage.getItem('currentTeam');
      
      // If no team is selected or the game is not in progress, do nothing
      if (!currentTeamId || state.state !== 'playing') {
        return state;
      }
      
      const team = state.teams.find(t => t.id === currentTeamId);
      
      // If team is locked out, do nothing
      if (!team || team.isLocked) {
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
        
        // Update the team's score and solved categories
        const updatedTeams = state.teams.map(t => {
          if (t.id === currentTeamId) {
            const updatedSolvedCategories = [...t.solvedCategories, category];
            return {
              ...t,
              score: t.score + 1,
              solvedCategories: updatedSolvedCategories
            };
          }
          return t;
        });
        
        // Check if the team has won (solved all categories)
        const updatedTeam = updatedTeams.find(t => t.id === currentTeamId);
        let winningTeam = state.winningTeam;
        let gameState = state.state;
        let endTime = state.endTime;
        
        if (updatedTeam && updatedTeam.solvedCategories.length === 4 && !state.winningTeam) {
          winningTeam = currentTeamId;
          gameState = 'ended';
          endTime = Date.now();
          toast({
            title: "Game Over!",
            description: `${updatedTeam.name} has won the game!`,
          });
        } else {
          toast({
            title: "Correct!",
            description: `You've found the ${categories[0]} category!`,
          });
        }
        
        return {
          ...state,
          words: updatedWords,
          categories: updatedCategories,
          teams: updatedTeams,
          winningTeam,
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
        
        // Increment the team's incorrect attempts
        const updatedTeams = state.teams.map(t => {
          if (t.id === currentTeamId) {
            const newIncorrectAttempts = t.incorrectAttempts + 1;
            const isLocked = newIncorrectAttempts >= state.settings.maxIncorrectAttempts;
            
            if (isLocked) {
              toast({
                title: "You've been locked out!",
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
              ...t,
              incorrectAttempts: newIncorrectAttempts,
              isLocked
            };
          }
          return t;
        });
        
        return { ...state, words: updatedWords, teams: updatedTeams };
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
    
    case 'SET_TEAM_READY': {
      const { teamId, isReady } = action.payload;
      const updatedTeams = state.teams.map(team => {
        if (team.id === teamId) {
          return { ...team, isReady };
        }
        return team;
      });
      
      return { ...state, teams: updatedTeams };
    }
    
    case 'START_GAME': {
      return {
        ...state,
        state: 'playing',
        startTime: Date.now()
      };
    }
    
    case 'END_GAME': {
      return {
        ...state,
        state: 'ended',
        endTime: Date.now(),
        winningTeam: action.payload || state.winningTeam
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
  
  const isInstructor = localStorage.getItem('isInstructor') === 'true';
  const currentTeamId = localStorage.getItem('currentTeam');
  const currentTeam = currentTeamId ? gameData.teams.find(team => team.id === currentTeamId) : null;
  const selectedWords = gameData.words.filter(word => word.selected);
  
  // Set up event listeners for real-time updates
  // In a real application, this would integrate with Supabase or WebSockets
  
  return (
    <GameContext.Provider
      value={{
        gameData,
        isInstructor,
        currentTeam,
        selectedWords,
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
