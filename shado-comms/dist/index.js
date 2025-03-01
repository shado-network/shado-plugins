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
  // | PuppetContext | PlayContext
  //
  constructor(config, _origin, _context) {
    this.config = {};
    //
    this.http = {
      server: void 0,
      config: {},
      secrets: {}
    };
    this.ws = {
      server: void 0,
      config: {},
      secrets: {},
      connections: {}
    };
    this._initHttpServer = () => __async(this, null, function* () {
      var _a;
      this._addHttpRoutes();
      this._addWebSocketEvents();
      try {
        yield (_a = this.http.server) == null ? void 0 : _a.listen({
          port: this.http.config.port
        });
        this._context.utils.logger.send({
          type: "SUCCESS",
          origin: {
            type: "PLUGIN",
            id: this._origin.id
          },
          data: {
            message: `Started Shad\u014D Comms http server at port ${this.http.config.port}`
          }
        });
      } catch (error) {
        this._context.utils.logger.send({
          type: "ERROR",
          origin: {
            type: "PLUGIN",
            id: this._origin.id
          },
          data: {
            message: "Could not start Shad\u014D Comms http server"
          }
        });
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
      var _a, _b, _c, _d;
      (_a = this.http.server) == null ? void 0 : _a.get("/", (request, reply) => __async(this, null, function* () {
        return {};
      }));
      (_b = this.http.server) == null ? void 0 : _b.get("/ping", (request, reply) => __async(this, null, function* () {
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
      (_c = this.http.server) == null ? void 0 : _c.get("/puppet", (request, reply) => __async(this, null, function* () {
        try {
          return {
            status: "success",
            timestamp: Date.now(),
            data: {
              message: `Puppet data for [ ${this._origin.id} / ${this._origin.name} ]`,
              puppet: {
                id: this._origin.id,
                name: this._origin.name,
                image: void 0,
                port: this.http.config.httPort
              }
            }
          };
        } catch (error) {
          return this._defaultRouteError(error);
        }
      }));
      (_d = this.http.server) == null ? void 0 : _d.get("/play", (request, reply) => __async(this, null, function* () {
        try {
          return {
            status: "success",
            timestamp: Date.now(),
            data: {
              message: `Play data for [ ${this._origin.id} / ${this._origin.name} ]`,
              play: {
                id: this._origin.id,
                name: this._origin.name,
                image: void 0,
                port: this.http.config.httPort
              }
            }
          };
        } catch (error) {
          return this._defaultRouteError(error);
        }
      }));
    };
    //
    this._initWebSocketServer = () => __async(this, null, function* () {
      var _a;
      try {
        (_a = this.ws.server) == null ? void 0 : _a.on("connection", (connection) => {
          const connectionId = uuidv4();
          this.ws.connections[connectionId] = connection;
        });
      } catch (error) {
      }
    });
    this._addWebSocketEvents = () => {
      this._origin.events.on("planner", (payload) => {
        broadcast(this.ws.connections, JSON.stringify(payload), false);
      });
    };
    var _a;
    this._context = _context;
    this._origin = _origin;
    this.http.config = __spreadValues(__spreadValues({}, this.http.config), config.http);
    this.http.secrets = __spreadValues({}, this.http.secrets);
    try {
      this.http.server = Fastify({
        // logger: true,
      });
      (_a = this.http.server) == null ? void 0 : _a.register(cors, {
        allowedHeaders: "*"
      });
    } catch (error) {
      this._context.utils.logger.send({
        type: "ERROR",
        origin: {
          type: "PLUGIN",
          id: this._origin.id
        },
        data: {
          message: "Could not create Shad\u014D Comms http server"
        }
      });
    }
    this.ws.config = __spreadValues(__spreadValues({}, this.ws.config), config.ws);
    this.ws.secrets = __spreadValues({}, this.ws.secrets);
    try {
      this.ws.server = new WebSocketServer({
        port: this.ws.config.port
      });
      this._context.utils.logger.send({
        type: "SUCCESS",
        origin: {
          type: "PLUGIN",
          id: this._origin.id
        },
        data: {
          message: `Started Shad\u014D Comms websocket server at port ${this.ws.config.port}`
        }
      });
    } catch (error) {
      this._context.utils.logger.send({
        type: "ERROR",
        origin: {
          type: "PLUGIN",
          id: this._origin.id
        },
        data: {
          message: "Could not create Shad\u014D Comms websocket server"
        }
      });
    }
    this._initHttpServer();
    this._initWebSocketServer();
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
