import { LoggerConfig } from '../types/logger.js';

declare class ShadoScreenClient {
    config: LoggerConfig;
    constructor(config: LoggerConfig);
}

export { ShadoScreenClient };
