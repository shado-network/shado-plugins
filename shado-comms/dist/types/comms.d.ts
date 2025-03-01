type HttpResponse = {
    status: 'success' | 'fail' | 'error';
    timestamp: number;
    data: undefined | {
        message: string;
        [key: string]: unknown;
    };
};
type WebSocketResponse = {
    timestamp: number;
    origin: string;
    data: {
        identifier: string;
        [key: string]: unknown;
    };
};

export type { HttpResponse, WebSocketResponse };
