type LoggerClient = 'shado-screen' | 'node-console';
type LoggerConfig = {
    showIcon: boolean;
    showUser: boolean;
};
type LoggerMessage = {
    type: 'SUCCESS' | 'WARNING' | 'ERROR' | 'INFO' | 'LOG' | 'SANDBOX';
    origin: {
        type: 'PLAY' | 'PUPPET' | 'AGENT' | 'USER' | 'PLUGIN';
        id?: string;
        name?: string;
    };
    data: {
        message: string;
        payload?: undefined | unknown;
    };
};

export type { LoggerClient, LoggerConfig, LoggerMessage };
