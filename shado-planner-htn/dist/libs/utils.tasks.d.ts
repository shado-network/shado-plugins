import { HtnTask } from '../types/planner.js';

declare const importTasks: (tasksPath: string) => Promise<HtnTask[]>;

export { importTasks };
