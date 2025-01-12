import { configureStore } from '@reduxjs/toolkit';
import timerReducer from './timerSlice';
import playerReducer from './playerSlice';

export const store = configureStore({
  reducer: {
    timer: timerReducer,
    player: playerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 