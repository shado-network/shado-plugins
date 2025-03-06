import { HtnTask } from './types/planner.js';

declare class ShadoPlannerHTN {
    static metadata: {
        identifier: string;
        description: string;
        key: string;
    };
    config: any;
    _tasks: undefined | {
        [key: string]: {
            [key: string]: HtnTask;
        };
    };
    _origin: any;
    _context: any;
    constructor(config: any, _origin: any, // | ShadoPuppet | ShadoPlay,
    _context: any);
    _registerTasks: () => Promise<{
        [key: string]: {
            [key: string]: HtnTask;
        };
    }>;
    setup: () => Promise<void>;
    start: () => void;
}

export { ShadoPlannerHTN as default };
