import { FastifyInstance } from 'fastify';
import WebSocket, { WebSocketServer } from 'ws';

declare class ShadoComms {
    static metadata: {
        identifier: string;
        description: string;
        key: string;
    };
    config: {};
    http: {
        server: undefined | FastifyInstance;
        config: any;
        secrets: any;
    };
    ws: {
        server: undefined | WebSocketServer;
        config: any;
        secrets: any;
        connections: {
            [key: string]: WebSocket;
        };
    };
    _origin: any;
    _context: any;
    constructor(config: {
        http: {
            port: number;
        };
        ws: {
            port: number;
        };
    }, _origin: any, // | ShadoPuppet | ShadoPlay,
    _context: any);
    _initHttpServer: () => Promise<void>;
    _defaultRouteError: (error: any) => {
        status: "error";
        timestamp: number;
        data: {
            message: string;
            error: any;
        };
    };
    _addHttpRoutes: () => void;
    _initWebSocketServer: () => Promise<void>;
    _addWebSocketEvents: () => void;
}

export { ShadoComms as default };
