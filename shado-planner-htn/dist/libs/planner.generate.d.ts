import { HtnTask } from '../types/planner.js';

declare const generatePlans: (tasksPool: HtnTask[], _origin: any, // | ShadoPuppet | ShadoPlay,
_context: any) => Promise<HtnTask[][]>;

export { generatePlans };
