import { LoggerMessage, LoggerConfig, LoggerClient } from './types/logger.js';

type AbstractLoggerClient = {
    send: (loggerMessage: LoggerMessage) => void;
};

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
