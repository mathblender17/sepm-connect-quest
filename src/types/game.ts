
export type GameState = 'lobby' | 'playing' | 'ended';

export type CategoryType = 'yellow' | 'green' | 'blue' | 'purple';

export interface Word {
  id: string;
  text: string;
  category: CategoryType;
  selected: boolean;
  solved: boolean;
}

export interface Category {
  type: CategoryType;
  name: string;
  description: string;
  solved: boolean;
}

export interface GameSettings {
  maxIncorrectAttempts: number;
}

export interface Player {
  name: string;
  score: number;
  solvedCategories: CategoryType[];
}

export interface GameData {
  id: string;
  state: GameState;
  words: Word[];
  categories: Category[];
  score: number;
  incorrectAttempts: number;
  solvedCategories: CategoryType[];
  settings: GameSettings;
  startTime: number | null;
  endTime: number | null;
  timeRemaining: number | null;
  players: Player[];
  currentPlayer: string | null;
}
