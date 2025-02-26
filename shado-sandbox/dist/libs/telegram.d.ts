import { SandboxConfig, SandboxMessage } from '../types/sandbox.js';

declare class SandboxTelegramClient {
    config: SandboxConfig;
    secrets: {
        botHandle: string;
        botToken: string;
        chatId: string;
    };
    client: any;
    _context: any;
    constructor(config: SandboxConfig, secrets: {
        botHandle: string;
        botToken: string;
        chatId: string;
    }, _context: any);
    _init: () => Promise<void>;
    _composeTelegramMessage: (sandboxMessage: SandboxMessage) => Promise<void>;
    send: (sandboxMessage: SandboxMessage) => Promise<void>;
}

export { SandboxTelegramClient };
