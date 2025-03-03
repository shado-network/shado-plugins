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

// src/tasks/twitter/twitter-get-messages.ts
var twitter_get_messages_default = {
  identifier: "twitter-get-messages",
  description: "Retrieve messages from Twitter.",
  conditions: {
    "twitter-has-client": (props) => {
      var _a;
      return ((_a = props._origin.memory.state) == null ? void 0 : _a["twitter-has-client"]) === true;
    },
    "twitter-has-logged-in": (props) => {
      var _a;
      return ((_a = props._origin.memory.state) == null ? void 0 : _a["twitter-has-logged-in"]) === true;
    },
    "twitter-has-messages": (props) => {
      var _a;
      return ((_a = props._origin.memory.state) == null ? void 0 : _a["twitter-has-messages"]) === false;
    }
  },
  effects: {
    "twitter-has-messages": {
      value: (props) => true,
      trigger: (props) => __async(void 0, null, function* () {
        props._origin.memory.state["twitter-has-messages"] = true;
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
        const messages = props._origin.clients["twitter"].getMessages();
        props._origin.memory.state["twitter-messages"] = messages;
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
  twitter_get_messages_default as default
};
