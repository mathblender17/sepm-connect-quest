import { CategoryType, GameData } from "../types/game";

export const mockCategories = [
  {
    type: 'yellow' as CategoryType,
    name: 'Product Development',
    description: 'Stages in building a product from idea to launch',
    solved: false
  },
  {
    type: 'green' as CategoryType,
    name: 'Product Strategy',
    description: 'Concepts used to define product direction and planning',
    solved: false
  },
  {
    type: 'blue' as CategoryType,
    name: 'User & Market Research',
    description: 'Methods to understand users and market needs',
    solved: false
  },
  {
    type: 'purple' as CategoryType,
    name: 'Product Metrics',
    description: 'Key metrics to evaluate product success',
    solved: false
  }
];

export const mockWords = [
  // Yellow category - Product Development
  { id: '1', text: 'Idea', category: 'yellow' as CategoryType, selected: false, solved: false },
  { id: '2', text: 'MVP', category: 'yellow' as CategoryType, selected: false, solved: false },
  { id: '3', text: 'Launch', category: 'yellow' as CategoryType, selected: false, solved: false },
  { id: '4', text: 'Iteration', category: 'yellow' as CategoryType, selected: false, solved: false },

  // Green category - Product Strategy
  { id: '5', text: 'Roadmap', category: 'green' as CategoryType, selected: false, solved: false },
  { id: '6', text: 'Backlog', category: 'green' as CategoryType, selected: false, solved: false },
  { id: '7', text: 'Feature', category: 'green' as CategoryType, selected: false, solved: false },
  { id: '8', text: 'Prioritization', category: 'green' as CategoryType, selected: false, solved: false },

  // Blue category - User & Market Research
  { id: '9', text: 'Personas', category: 'blue' as CategoryType, selected: false, solved: false },
  { id: '10', text: 'Customer Journey', category: 'blue' as CategoryType, selected: false, solved: false },
  { id: '11', text: 'Market Fit', category: 'blue' as CategoryType, selected: false, solved: false },
  { id: '12', text: 'Usability Testing', category: 'blue' as CategoryType, selected: false, solved: false },

  // Purple category - Product Metrics
  { id: '13', text: 'Retention', category: 'purple' as CategoryType, selected: false, solved: false },
  { id: '14', text: 'Churn', category: 'purple' as CategoryType, selected: false, solved: false },
  { id: '15', text: 'NPS (Net Promoter Score)', category: 'purple' as CategoryType, selected: false, solved: false },
  { id: '16', text: 'Revenue', category: 'purple' as CategoryType, selected: false, solved: false }
];

export const createMockGame = (): GameData => {
  // Shuffle the words
  const shuffledWords = [...mockWords].sort(() => Math.random() - 0.5);
  
  return {
    id: '1',
    state: 'lobby',
    words: shuffledWords,
    categories: mockCategories,
    score: 0,
    incorrectAttempts: 0,
    solvedCategories: [],
    settings: {
      maxIncorrectAttempts: 4
    },
    startTime: null,
    endTime: null,
    timeRemaining: 270 // 4:30 min = 270 seconds
  };
};
