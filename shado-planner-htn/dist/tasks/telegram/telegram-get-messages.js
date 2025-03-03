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

// src/tasks/telegram/telegram-get-messages.ts
var telegram_get_messages_default = {
  identifier: "telegram-get-messages",
  description: "Retrieve messages received on Telegram.",
  conditions: {
    "telegram-has-client": (props) => {
      var _a;
      return ((_a = props._origin.memory.state) == null ? void 0 : _a["telegram-has-client"]) === true;
    },
    "telegram-has-messages": (props) => {
      var _a;
      return ((_a = props._origin.memory.state) == null ? void 0 : _a["telegram-has-messages"]) === false;
    }
  },
  effects: {
    "telegram-has-messages": {
      value: (props) => true,
      trigger: (props) => __async(void 0, null, function* () {
        var _a, _b;
        props._origin.memory.state["telegram-has-messages"] = ((_b = (_a = props._origin.memory.state) == null ? void 0 : _a["telegram-messages"]) == null ? void 0 : _b.length) > 0;
        return {
          success: true,
          payload: void 0
        };
      })
    }
  },
  actions: {
    "telegram-get-messages": (props) => __async(void 0, null, function* () {
      try {
        const messages = props._origin.clients["telegram"].getMessages();
        props._origin.memory.state["telegram-messages"] = messages;
        return {
          success: true,
          payload: messages
        };
      } catch (error) {
        return {
          success: false,
          payload: error
        };
      }
    })
  }
};
export {
  telegram_get_messages_default as default
};
