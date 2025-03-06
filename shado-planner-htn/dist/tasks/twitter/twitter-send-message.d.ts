import { ValueProps, TriggerProps } from '../../types/planner.js';

declare const _default: {
    identifier: string;
    description: string;
    conditions: {
        'twitter-has-client': (props: ValueProps) => boolean;
        'twitter-has-logged-in': (props: ValueProps) => boolean;
        'twitter-last-sent': (props: ValueProps) => boolean;
    };
    effects: {
        'twitter-last-sent': {
            value: (props: ValueProps) => boolean;
            trigger: (props: TriggerProps) => Promise<{
                success: true;
                payload: undefined;
            }>;
        };
    };
    actions: {
        'twitter-send-message': (props: TriggerProps) => Promise<{
            success: true;
            payload: any;
        } | {
            success: false;
            payload: unknown;
        }>;
    };
};

export { _default as default };
