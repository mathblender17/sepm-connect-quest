
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

export interface Team {
  id: string;
  name: string;
  isReady: boolean;
  score: number;
  incorrectAttempts: number;
  solvedCategories: CategoryType[];
  isLocked: boolean;
}

export interface GameSettings {
  maxIncorrectAttempts: number;
}

export interface GameData {
  id: string;
  code: string;
  state: GameState;
  instructor: string;
  teams: Team[];
  words: Word[];
  categories: Category[];
  settings: GameSettings;
  winningTeam: string | null;
  startTime: number | null;
  endTime: number | null;
}
