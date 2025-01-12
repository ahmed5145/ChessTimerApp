import { TimeFormat } from '../types/timer';

export const formatTime = (ms: number): string => {
  const totalSeconds = Math.max(Math.floor(ms / 1000), 0);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const isLowTime = (ms: number): boolean => {
  return ms <= 30000; // 30 seconds
};

export const DEFAULT_TIME_CONTROLS: TimeFormat[] = [
  {
    id: 'bullet1',
    name: 'Bullet 1+0',
    minutes: 1,
    seconds: 0,
    increment: 0,
  },
  {
    id: 'bullet2',
    name: 'Bullet 2+1',
    minutes: 2,
    seconds: 0,
    increment: 1,
  },
  {
    id: 'blitz3',
    name: 'Blitz 3+0',
    minutes: 3,
    seconds: 0,
    increment: 0,
  },
  {
    id: 'blitz5',
    name: 'Blitz 5+3',
    minutes: 5,
    seconds: 0,
    increment: 3,
  },
  {
    id: 'rapid10',
    name: 'Rapid 10+0',
    minutes: 10,
    seconds: 0,
    increment: 0,
  },
  {
    id: 'rapid15',
    name: 'Rapid 15+10',
    minutes: 15,
    seconds: 0,
    increment: 10,
  },
]; 