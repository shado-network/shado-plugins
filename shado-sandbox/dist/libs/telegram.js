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

// src/libs/telegram.ts
import TelegramClient from "@shado-network/client-telegram";
import { fmt, code } from "@shado-network/client-telegram";
var SandboxTelegramClient = class {
  // | PuppetContext
  constructor(config, secrets, _context) {
    this.config = {};
    this._init = () => __async(this, null, function* () {
      try {
        const sandboxPuppet = {
          id: "sandbox",
          name: "Shad\u014D Puppet Sandbox",
          //
          bio: void 0
        };
        const sandboxContext = {
          logger: void 0,
          sandbox: this
        };
        this.client = new TelegramClient(
          this.config,
          this.secrets,
          sandboxPuppet,
          sandboxContext
        );
      } catch (error) {
        this._context.utils.logger.send({
          type: "ERROR",
          origin: {
            type: "SERVER"
          },
          data: {
            message: "Could not start Telegram sandbox client",
            payload: { error }
          }
        });
      }
    });
    this._composeTelegramMessage = (sandboxMessage) => __async(this, null, function* () {
      var _a;
      const message = fmt`
  [ PUPPET / ${(_a = sandboxMessage.origin.id) == null ? void 0 : _a.toUpperCase()} ]
  ${sandboxMessage.data.message}
  
  PAYLOAD: 
  ${code`${JSON.stringify(sandboxMessage.data.payload || null, null, 2)}`}
  `;
      yield this.client.sendMessage(message, this.secrets.chatId);
    });
    this.send = (sandboxMessage) => __async(this, null, function* () {
      yield this._composeTelegramMessage(sandboxMessage);
    });
    this._context = _context;
    this.config = __spreadValues(__spreadValues({}, this.config), config);
    this.secrets = __spreadValues({}, secrets);
    this._init();
  }
};
export {
  SandboxTelegramClient
};
