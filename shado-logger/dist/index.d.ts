import { LoggerConfig, LoggerClient, LoggerMessage } from './types/logger.js';
import { AbstractLoggerClient } from './types/abstract.js';

declare class ShadoLogger {
    static metadata: {
        identifier: string;
        description: string;
        key: string;
    };
    config: LoggerConfig;
    clients: AbstractLoggerClient[];
    constructor(clientIdentifiers: LoggerClient[], config?: Partial<LoggerConfig>);
    _initClients: (clientIdentifiers: string[]) => void;
    send: (loggerMessage: LoggerMessage) => void;
}

export { ShadoLogger as default };
