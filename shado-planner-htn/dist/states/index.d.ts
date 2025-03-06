declare const defaultStates: {
    telegram: {
        'telegram-last-updated': number;
        'telegram-has-messages': boolean;
        'telegram-messages': never[];
        'telegram-last-replied': number;
    };
    twitter: {
        'twitter-last-updated': number;
        'twitter-has-logged-in': boolean;
        'twitter-last-log-in-attempt': number;
        'twitter-last-sent': number;
    };
};

export { defaultStates };
