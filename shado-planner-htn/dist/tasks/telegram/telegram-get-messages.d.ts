import { ValueProps, TriggerProps } from '../../types/planner.js';

declare const _default: {
    identifier: string;
    description: string;
    conditions: {
        'telegram-has-client': (props: ValueProps) => boolean;
        'telegram-has-messages': (props: ValueProps) => boolean;
    };
    effects: {
        'telegram-has-messages': {
            value: (props: ValueProps) => true;
            trigger: (props: TriggerProps) => Promise<{
                success: true;
                payload: undefined;
            }>;
        };
    };
    actions: {
        'telegram-get-messages': (props: TriggerProps) => Promise<{
            success: true;
            payload: any;
        } | {
            success: false;
            payload: unknown;
        }>;
    };
};

export { _default as default };
