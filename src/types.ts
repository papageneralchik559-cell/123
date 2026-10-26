export interface Lesson {
  id: string;
  name: string;
  duration: number; // in seconds
  subject: string;
  completed: boolean;
}

export interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  currentLessonIndex: number;
  timeRemaining: number;
  totalTime: number;
  isBreak: boolean;
  breakDuration: number;
}

export type Subject = {
  name: string;
  color: string;
  emoji: string;
};
