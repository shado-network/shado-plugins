import { LoggerConfig, LoggerMessage } from '../types/logger.js';

declare class NodeConsoleClient {
    config: LoggerConfig;
    colors: {
        fg: {
            black: string;
            red: string;
            green: string;
            yellow: string;
            blue: string;
            magenta: string;
            cyan: string;
            white: string;
            gray: string;
            default: string;
            clear: string;
        };
        bg: {
            black: string;
            red: string;
            green: string;
            yellow: string;
            blue: string;
            magenta: string;
            cyan: string;
            white: string;
            gray: string;
            default: string;
            clear: string;
        };
    };
    icons: {
        success: string;
        warning: string;
        danger: string;
        info: string;
        default: string;
    };
    constructor(config: LoggerConfig);
    _getIcon: (type: string) => string;
    _setConsoleColor: (fgColorName?: string, bgColorName?: string) => string;
    _resetConsoleColor: () => string;
    _composeConsoleMessage: (loggerMessage: LoggerMessage) => void;
    send: (loggerMessage: LoggerMessage) => void;
}

export { NodeConsoleClient };
