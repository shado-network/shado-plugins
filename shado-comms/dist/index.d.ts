import { FastifyInstance } from 'fastify';
import WebSocket, { WebSocketServer } from 'ws';

declare class ShadoComms {
    static metadata: {
        identifier: string;
        description: string;
        key: string;
    };
    config: {};
    httpServer: undefined | FastifyInstance;
    httpServerConfig: any;
    httpServerSecrets: any;
    wsServer: undefined | WebSocketServer;
    wsServerConfig: any;
    wsServerSecrets: any;
    wsConnections: {
        [key: string]: WebSocket;
    };
    _puppet: any;
    _context: any;
    constructor(config: {
        http: {
            port: number;
        };
        ws: {
            port: number;
        };
    }, _puppet: any, _context: any);
    _init: () => Promise<void>;
    _defaultRouteError: (error: any) => {
        status: "error";
        timestamp: number;
        data: {
            message: string;
            error: any;
        };
    };
    _addHttpRoutes: () => void;
    _addWebSocketEvents: () => void;
}

export { ShadoComms as default };
