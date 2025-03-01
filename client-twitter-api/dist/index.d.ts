import { TwitterApi } from 'twitter-api-v2';

declare class TwitterApiClient {
    static metadata: {
        identifier: string;
        description: string;
        key: string;
    };
    config: {};
    secrets: {
        appKey?: string;
        appSecret?: string;
        accessToken?: string;
        accessSecret?: string;
    };
    client: undefined | TwitterApi;
    threads: string[];
    messages: any[];
    _puppet: any;
    _context: any;
    constructor(config: {}, secrets: {
        appKey: string;
        appSecret: string;
        accessToken: string;
        accessSecret: string;
    }, _puppet: any, // | ShadoPuppet,
    _context: any);
    login: () => Promise<boolean>;
    getMessageThreads: () => string[];
    addMessageThread: (threadIdentifier: string) => void;
    sendMessage: (message: string) => Promise<void>;
}

export { TwitterApiClient as default };
