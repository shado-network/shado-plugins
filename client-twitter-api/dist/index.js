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
import { TwitterApi } from "twitter-api-v2";
var TwitterApiClient = class {
  constructor(config, secrets, _puppet, _context) {
    this.config = {};
    this.secrets = {};
    this.threads = [];
    this.messages = [];
    this.login = () => __async(this, null, function* () {
      try {
        const credentials = {
          appKey: this.secrets.appKey || "UNDEFINED",
          appSecret: this.secrets.appSecret || "UNDEFINED",
          accessToken: this.secrets.accessToken || "UNDEFINED",
          accessSecret: this.secrets.accessSecret || "UNDEFINED"
        };
        const settings = {};
        this.client = new TwitterApi(credentials, settings);
        return true;
      } catch (error) {
        this._context.logger.send({
          type: "ERROR",
          origin: {
            type: "PUPPET",
            id: this._puppet.id
          },
          data: {
            message: `Error connecting to Twitter bot`,
            payload: { error }
          }
        });
        return false;
      }
    });
    this.getMessageThreads = () => {
      return this.threads;
    };
    this.addMessageThread = (threadIdentifier) => {
      this.threads.push(threadIdentifier);
    };
    this.sendMessage = (message) => __async(this, null, function* () {
      var _a;
      if (this._context.config.sandboxMode) {
        this._context.sandbox.send({
          type: "SANDBOX",
          origin: {
            type: "PUPPET",
            id: this._puppet.id
          },
          data: {
            message: "client-twitter-api | sendMessage()",
            payload: { message }
          }
        });
        return;
      }
      const response = yield (_a = this.client) == null ? void 0 : _a.v2.tweet(message);
    });
    this._context = _context;
    this._puppet = _puppet;
    this.config = __spreadValues(__spreadValues({}, this.config), config);
    this.secrets = __spreadValues(__spreadValues({}, this.secrets), secrets);
    this._context.logger.send({
      type: "SUCCESS",
      origin: {
        type: "PUPPET",
        id: this._puppet.id
      },
      data: {
        message: `Loaded client plugin "client-twitter-api"`
      }
    });
  }
};
TwitterApiClient.metadata = {
  identifier: "client-twitter-api",
  description: "Basic Twitter API client.",
  //
  key: "twitter"
};
var index_default = TwitterApiClient;
export {
  index_default as default
};
