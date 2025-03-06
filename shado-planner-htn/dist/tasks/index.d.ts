import { HtnTask } from '../types/planner.js';

declare const tasksPool: (_origin: any, // | ShadoPuppet | ShadoPlay,
_tasks: any) => HtnTask[];

export { tasksPool };
