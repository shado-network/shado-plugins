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
import { ChatOpenAI } from "@langchain/openai";
var OpenAiAdapter = class {
  constructor(config, secrets, _puppet, _context) {
    this.config = {
      model: "gpt-4o-mini",
      temperature: 1,
      maxTokens: 256
      // apiKey,
    };
    this.getMessagesResponse = (messages, props) => __async(this, null, function* () {
      const response = yield this._memoryClient.invoke(
        { messages },
        { configurable: { thread_id: props.thread } }
      );
      if (!response || !response.messages || response.messages.length === 0) {
        this._context.logger.send({
          type: "WARNING",
          origin: {
            type: "SERVER"
          },
          data: {
            message: "Error parsing response",
            payload: { content: response.content }
          }
        });
      }
      return response.messages[response.messages.length - 1].content;
    });
    this._context = _context;
    this._puppet = _puppet;
    this.adapter = new ChatOpenAI(__spreadValues(__spreadValues(__spreadValues({}, this.config), config), secrets));
    this._memoryClient = this._puppet._memoryClient(this.adapter);
  }
};
OpenAiAdapter.metadata = {
  identifier: "adapter-openai",
  description: "Wrapper for OpenAI interaction through LangChain.",
  //
  key: "model"
};
var index_default = OpenAiAdapter;
export {
  index_default as default
};
