import { ValueProps, TriggerProps } from '../../types/planner.js';

declare const _default: {
    identifier: string;
    description: string;
    conditions: {
        'telegram-has-client': (props: ValueProps) => boolean;
        'telegram-has-messages': (props: ValueProps) => boolean;
        'telegram-last-replied': (props: ValueProps) => boolean;
    };
    effects: {
        'telegram-has-messages': {
            value: (props: ValueProps) => false;
            trigger: (props: TriggerProps) => Promise<{
                success: true;
                payload: undefined;
            }>;
        };
        'telegram-last-replied': {
            value: (props: ValueProps) => boolean;
            trigger: (props: TriggerProps) => Promise<{
                success: true;
                payload: undefined;
            }>;
        };
    };
    actions: {
        'telegram-read-messages': (props: TriggerProps) => Promise<{
            success: true;
            payload: undefined;
        } | {
            success: false;
            payload: unknown;
        }>;
    };
};

export { _default as default };
