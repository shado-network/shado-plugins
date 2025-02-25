import WebSocket from 'ws';

declare const broadcast: (clients: {
    [key: string]: WebSocket;
}, data: string, isBinary: boolean) => void;

export { broadcast };
