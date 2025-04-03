
import { CategoryType, GameData } from "../types/game";

const generateGameCode = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const mockCategories = [
  {
    type: 'yellow' as CategoryType,
    name: 'Agile Methodologies',
    description: 'Concepts related to Agile software development approach',
    solved: false
  },
  {
    type: 'green' as CategoryType,
    name: 'Programming Paradigms',
    description: 'Different approaches to programming and code organization',
    solved: false
  },
  {
    type: 'blue' as CategoryType,
    name: 'Software Testing',
    description: 'Methods and concepts related to testing software',
    solved: false
  },
  {
    type: 'purple' as CategoryType,
    name: 'Product Management',
    description: 'Concepts related to managing software products',
    solved: false
  }
];

export const mockWords = [
  // Yellow category - Agile Methodologies
  { id: '1', text: 'Scrum', category: 'yellow' as CategoryType, selected: false, solved: false },
  { id: '2', text: 'Sprint', category: 'yellow' as CategoryType, selected: false, solved: false },
  { id: '3', text: 'Kanban', category: 'yellow' as CategoryType, selected: false, solved: false },
  { id: '4', text: 'Retrospective', category: 'yellow' as CategoryType, selected: false, solved: false },
  
  // Green category - Programming Paradigms
  { id: '5', text: 'Object-Oriented', category: 'green' as CategoryType, selected: false, solved: false },
  { id: '6', text: 'Functional', category: 'green' as CategoryType, selected: false, solved: false },
  { id: '7', text: 'Procedural', category: 'green' as CategoryType, selected: false, solved: false },
  { id: '8', text: 'Declarative', category: 'green' as CategoryType, selected: false, solved: false },
  
  // Blue category - Software Testing
  { id: '9', text: 'Unit Test', category: 'blue' as CategoryType, selected: false, solved: false },
  { id: '10', text: 'Integration', category: 'blue' as CategoryType, selected: false, solved: false },
  { id: '11', text: 'Regression', category: 'blue' as CategoryType, selected: false, solved: false },
  { id: '12', text: 'Acceptance', category: 'blue' as CategoryType, selected: false, solved: false },
  
  // Purple category - Product Management
  { id: '13', text: 'MVP', category: 'purple' as CategoryType, selected: false, solved: false },
  { id: '14', text: 'User Story', category: 'purple' as CategoryType, selected: false, solved: false },
  { id: '15', text: 'Roadmap', category: 'purple' as CategoryType, selected: false, solved: false },
  { id: '16', text: 'Personas', category: 'purple' as CategoryType, selected: false, solved: false }
];

export const mockTeams = [
  {
    id: '1',
    name: 'Team Alpha',
    isReady: true,
    score: 0,
    incorrectAttempts: 0,
    solvedCategories: [] as CategoryType[],
    isLocked: false
  },
  {
    id: '2',
    name: 'Team Beta',
    isReady: true,
    score: 0,
    incorrectAttempts: 0,
    solvedCategories: [] as CategoryType[],
    isLocked: false
  },
  {
    id: '3',
    name: 'Team Gamma',
    isReady: false,
    score: 0,
    incorrectAttempts: 0,
    solvedCategories: [] as CategoryType[],
    isLocked: false
  }
];

export const createMockGame = (): GameData => {
  // Shuffle the words
  const shuffledWords = [...mockWords].sort(() => Math.random() - 0.5);
  
  return {
    id: '1',
    code: generateGameCode(),
    state: 'lobby',
    instructor: 'Instructor',
    teams: mockTeams,
    words: shuffledWords,
    categories: mockCategories,
    settings: {
      maxIncorrectAttempts: 4
    },
    winningTeam: null,
    startTime: null,
    endTime: null
  };
};
