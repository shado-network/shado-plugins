var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/index.ts
import { v4 as uuidv4 } from "uuid";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { WebSocketServer } from "ws";

// src/libs/utils.websocket.ts
var broadcast = (clients, data, isBinary) => {
  Object.keys(clients).forEach((clientId) => {
    clients[clientId].send(data, { binary: isBinary });
  });
};

// src/index.ts
var ShadoComms = class {
  //
  constructor(config, _puppet, _context) {
    this.config = {};
    this.httpServerConfig = {};
    this.httpServerSecrets = {};
    this.wsServerConfig = {};
    this.wsServerSecrets = {};
    this.wsConnections = {};
    this._init = () => __async(this, null, function* () {
      var _a, _b;
      this._addHttpRoutes();
      this._addWebSocketEvents();
      try {
        yield (_a = this.httpServer) == null ? void 0 : _a.listen({
          port: this.httpServerConfig.port
        });
        this._context.logger.send({
          type: "SUCCESS",
          origin: {
            type: "PLUGIN",
            id: this._puppet.id
          },
          data: {
            message: `Started Shad\u014D Comms http server at port ${this.httpServerConfig.port}`
          }
        });
      } catch (error) {
        this._context.logger.send({
          type: "ERROR",
          origin: {
            type: "PLUGIN",
            id: this._puppet.id
          },
          data: {
            message: "Could not start Shad\u014D Comms http server"
          }
        });
      }
      try {
        (_b = this.wsServer) == null ? void 0 : _b.on("connection", (connection) => {
          const connectionId = uuidv4();
          this.wsConnections[connectionId] = connection;
        });
      } catch (error) {
      }
    });
    //
    this._defaultRouteError = (error) => {
      return {
        status: "error",
        timestamp: Date.now(),
        data: {
          message: "Something went wrong",
          error
        }
      };
    };
    this._addHttpRoutes = () => {
      var _a, _b, _c;
      (_a = this.httpServer) == null ? void 0 : _a.get("/", (request, reply) => __async(this, null, function* () {
        return {};
      }));
      (_b = this.httpServer) == null ? void 0 : _b.get("/ping", (request, reply) => __async(this, null, function* () {
        try {
          return {
            status: "success",
            timestamp: Date.now(),
            data: {
              message: "PONG"
            }
          };
        } catch (error) {
          return this._defaultRouteError(error);
        }
      }));
      (_c = this.httpServer) == null ? void 0 : _c.get("/puppet", (request, reply) => __async(this, null, function* () {
        try {
          return {
            status: "success",
            timestamp: Date.now(),
            data: {
              message: `Puppet data for [ ${this._puppet.id} / ${this._puppet.config.name} ]`,
              puppet: {
                id: this._puppet.id,
                name: this._puppet.config.name,
                image: void 0,
                port: this.httpServerConfig.httPort
              }
            }
          };
        } catch (error) {
          return this._defaultRouteError(error);
        }
      }));
    };
    this._addWebSocketEvents = () => {
      this._puppet.events.on("planner", (payload) => {
        broadcast(this.wsConnections, JSON.stringify(payload), false);
      });
    };
    var _a;
    this._context = _context;
    this._puppet = _puppet;
    this.httpServerConfig = __spreadValues(__spreadValues({}, this.httpServerConfig), config.http);
    this.httpServerSecrets = __spreadValues({}, this.httpServerSecrets);
    this.wsServerConfig = __spreadValues(__spreadValues({}, this.wsServerConfig), config.ws);
    this.wsServerSecrets = __spreadValues({}, this.wsServerSecrets);
    try {
      this.httpServer = Fastify({
        // logger: true,
      });
      (_a = this.httpServer) == null ? void 0 : _a.register(cors, {
        allowedHeaders: "*"
      });
    } catch (error) {
      this._context.logger.send({
        type: "ERROR",
        origin: {
          type: "PLUGIN",
          id: this._puppet.id
        },
        data: {
          message: "Could not create Shad\u014D Comms http server"
        }
      });
    }
    try {
      this.wsServer = new WebSocketServer({
        port: this.wsServerConfig.port
      });
      this._context.logger.send({
        type: "SUCCESS",
        origin: {
          type: "PLUGIN",
          id: this._puppet.id
        },
        data: {
          message: `Started Shad\u014D Comms websocket server at port ${this.wsServerConfig.port}`
        }
      });
    } catch (error) {
      this._context.logger.send({
        type: "ERROR",
        origin: {
          type: "PLUGIN",
          id: this._puppet.id
        },
        data: {
          message: "Could not create Shad\u014D Comms websocket server"
        }
      });
    }
    this._init();
  }
};
ShadoComms.metadata = {
  identifier: "shado-comms",
  description: "First party intra-communication utility.",
  //
  key: "comms"
};
var index_default = ShadoComms;
export {
  index_default as default
};
