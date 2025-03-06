type HtnGoal = {
    identifier: string;
    description: string;
    evaluator: (props: GoalProps) => boolean;
};
type HtnTask = {
    identifier: string;
    description: string;
    conditions: {
        [key: string]: (props: ValueProps) => boolean;
    };
    effects: {
        [key: string]: {
            value: (props: ValueProps) => boolean;
            trigger: (props: TriggerProps) => Promise<{
                success: boolean;
                payload: any;
            }>;
        };
    };
    actions: {
        [key: string]: (props: TriggerProps) => Promise<{
            success: boolean;
            payload: any;
        }>;
    };
};
type GoalProps = {
    _origin: any;
    _context: any;
};
type ValueProps = {
    _origin: any;
    _context: any;
};
type TriggerProps = {
    _origin: any;
    _context: any;
};

export type { GoalProps, HtnGoal, HtnTask, TriggerProps, ValueProps };
