import { SandboxConfig, SandboxMessage } from './types/sandbox.js';

declare class ShadoSandboxPlugin {
    static metadata: {
        identifier: string;
        description: string;
        key: string;
    };
    config: SandboxConfig;
    secrets: {
        botHandle: string;
        botToken: string;
        chatId: string;
    };
    clients: any[];
    _context: any;
    constructor(clientIdentifiers: string[], secrets: {
        botHandle: string;
        botToken: string;
        chatId: string;
    }, _context: any);
    _setClients: (clientIdentifiers: string[]) => void;
    send: (sandboxMessage: SandboxMessage) => void;
}

export { ShadoSandboxPlugin as default };
