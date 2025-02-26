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
import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
var TelegramClient = class {
  constructor(config, secrets, _puppet, _context) {
    this.config = {
      // SECONDS_PER_CHAR: 0.0125,
    };
    this.secrets = {};
    this.threads = [];
    this.messages = [];
    this._init = () => __async(this, null, function* () {
      var _a, _b;
      (_a = this.client) == null ? void 0 : _a.on(message("text"), (ctx) => {
        this._storeMessage(ctx);
      });
      (_b = this.client) == null ? void 0 : _b.launch();
      process.once("SIGINT", () => {
        var _a2;
        return (_a2 = this.client) == null ? void 0 : _a2.stop("SIGINT");
      });
      process.once("SIGTERM", () => {
        var _a2;
        return (_a2 = this.client) == null ? void 0 : _a2.stop("SIGTERM");
      });
    });
    this._storeMessage = (ctx) => __async(this, null, function* () {
      const message2 = {
        id: ctx.message.message_id,
        text: ctx.message.text,
        is_read: false,
        //
        from: {
          id: ctx.message.from.id,
          name: ctx.message.from.first_name
        },
        metadata: {
          chat: { type: ctx.message.chat.type },
          replyFn: (message3) => __async(this, null, function* () {
            yield ctx.reply(message3, {
              reply_to_message_id: ctx.message.message_id
            });
          })
        }
      };
      this.messages.push(message2);
      return message2;
    });
    this.getMessageThreads = () => {
      return this.threads;
    };
    this.addMessageThread = (threadIdentifier) => {
      this.threads.push(threadIdentifier);
    };
    this.getMessages = () => {
      return this.messages.filter((message2) => !message2.is_read);
    };
    this.clearReadMessages = () => {
      this.messages = this.messages.filter((message2) => !message2.is_read);
    };
    this.sendMessage = (message2, chatId) => __async(this, null, function* () {
      var _a;
      const newCtx = yield (_a = this.client) == null ? void 0 : _a.telegram.sendMessage(chatId, message2);
    });
    this.replyToMessage = (message2, replyFn) => __async(this, null, function* () {
      const newCtx = yield replyFn(message2);
    });
    this.markAsRead = (messageId) => __async(this, null, function* () {
      const message2 = this.messages.find((message3) => message3.id === messageId);
      if (!message2) {
        return;
      }
      message2.is_read = true;
    });
    this._context = _context;
    this._puppet = _puppet;
    this.config = __spreadValues(__spreadValues({}, this.config), config);
    this.secrets = __spreadValues(__spreadValues({}, this.secrets), secrets);
    try {
      this.client = new Telegraf(this.secrets.botToken || "UNDEFINED");
    } catch (error) {
      this._context.logger.send({
        type: "ERROR",
        origin: {
          type: "PUPPET",
          id: this._puppet.id
        },
        data: {
          message: "Could not connect to Telegram bot"
        }
      });
    }
    this._init();
  }
};
TelegramClient.metadata = {
  identifier: "client-telegram",
  description: "Basic Telegram client through Telegraf.",
  //
  key: "telegram"
};
var index_default = TelegramClient;
export {
  index_default as default
};
