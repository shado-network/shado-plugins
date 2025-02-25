// src/libs/utils.websocket.ts
var broadcast = (clients, data, isBinary) => {
  Object.keys(clients).forEach((clientId) => {
    clients[clientId].send(data, { binary: isBinary });
  });
};
export {
  broadcast
};
