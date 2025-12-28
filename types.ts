export enum AppStep {
  WELCOME = 'WELCOME',
  QUIZ_A = 'QUIZ_A',
  SHARE_LINK = 'SHARE_LINK',
  WELCOME_B = 'WELCOME_B',
  QUIZ_B = 'QUIZ_B',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS',
  ERROR = 'ERROR'
}

export interface Question {
  id: number;
  text: string;
  options: {
    value: string;
    label: string;
    emoji: string;
  }[];
}

export interface UserAnswers {
  [questionId: number]: string; // value
}

export interface CompatibilityResult {
  score: number;
  summary: string;
  strengths: string[];
  challenges: string[];
  forecast: string;
}

export interface DecodedState {
  answersA?: UserAnswers;
  step?: AppStep;
}