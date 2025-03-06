import { ValueProps, TriggerProps } from '../../types/planner.js';

declare const _default: {
    identifier: string;
    description: string;
    conditions: {
        'twitter-has-client': (props: ValueProps) => boolean;
        'twitter-has-logged-in': (props: ValueProps) => boolean;
        'twitter-last-log-in': (props: ValueProps) => boolean;
    };
    effects: {
        'twitter-has-logged-in': {
            value: (props: ValueProps) => true;
            trigger: (props: TriggerProps) => Promise<{
                success: true;
                payload: undefined;
            }>;
        };
        'twitter-last-log-in-attempt': {
            value: (props: ValueProps) => boolean;
            trigger: (props: TriggerProps) => Promise<{
                success: true;
                payload: undefined;
            }>;
        };
    };
    actions: {
        'twitter-log-in': (props: TriggerProps) => Promise<{
            success: true;
            payload: undefined;
        } | {
            success: false;
            payload: unknown;
        }>;
    };
};

export { _default as default };
