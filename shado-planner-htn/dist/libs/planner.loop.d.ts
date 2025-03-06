import { HtnTask } from '../types/planner.js';

declare const plannerLoop: (tasksPool: HtnTask[], _origin: any, // | ShadoPuppet | ShadoPlay,
_context: any) => Promise<void>;

export { plannerLoop };
