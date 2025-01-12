export interface TimeFormat {
  id: string;
  name: string;
  minutes: number;
  seconds: number;
  increment: number;
}

export interface PlayerState {
  timeRemaining: number;
  isActive: boolean;
  isLowTime: boolean;
  name: string;
}

export interface TimerState {
  player1: PlayerState;
  player2: PlayerState;
  isGameActive: boolean;
  isPaused: boolean;
  selectedTimeControl: TimeFormat;
  playerNames: {
    player1: string;
    player2: string;
  };
}

export interface RootState {
  timer: TimerState;
} 