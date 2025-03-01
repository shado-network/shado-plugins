import { Telegraf } from 'telegraf';
import { FmtString } from 'telegraf/format';
export { code, fmt } from 'telegraf/format';
import { TelegramMessage } from './types/telegram.js';

declare class TelegramClient {
    static metadata: {
        identifier: string;
        description: string;
        key: string;
    };
    config: {};
    secrets: {
        botHandle?: string;
        botToken?: string;
        chatId?: string;
    };
    client: undefined | Telegraf;
    threads: string[];
    messages: TelegramMessage[];
    _puppet: any;
    _context: any;
    constructor(config: {}, secrets: {
        botHandle: string;
        botToken: string;
        chatId?: string;
    }, _puppet: any, // | ShadoPuppet,
    _context: any);
    _init: () => Promise<void>;
    _storeMessage: (ctx: any) => Promise<TelegramMessage>;
    getMessageThreads: () => string[];
    addMessageThread: (threadIdentifier: string) => void;
    getMessages: () => TelegramMessage[];
    clearReadMessages: () => void;
    sendMessage: (message: string | FmtString, chatId: string) => Promise<void>;
    replyToMessage: (message: string, replyFn: (message: string) => Promise<void>) => Promise<void>;
    markAsRead: (messageId: number) => Promise<void>;
}

export { TelegramMessage, TelegramClient as default };
