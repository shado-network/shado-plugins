import { LoggerMessage } from './logger.js';

type AbstractLoggerClient = {
    send: (loggerMessage: LoggerMessage) => void;
};

export type { AbstractLoggerClient };
