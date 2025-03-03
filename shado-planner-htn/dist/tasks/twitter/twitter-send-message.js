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

// src/tasks/twitter/twitter-send-message.ts
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

// src/libs/constants.ts
var SEC_IN_MSEC = 1e3;
var MIN_IN_MSEC = 60 * SEC_IN_MSEC;
var HOUR_IN_MSEC = 60 * MIN_IN_MSEC;
var DAY_IN_MSEC = 24 * HOUR_IN_MSEC;

// src/tasks/twitter/twitter-send-message.ts
var twitter_send_message_default = {
  identifier: "twitter-send-message",
  description: "Post a message to Twitter.",
  conditions: {
    "twitter-has-client": (props) => {
      var _a;
      return ((_a = props._origin.memory.state) == null ? void 0 : _a["twitter-has-client"]) === true;
    },
    "twitter-has-logged-in": (props) => {
      var _a;
      return ((_a = props._origin.memory.state) == null ? void 0 : _a["twitter-has-logged-in"]) === true;
    },
    "twitter-last-sent": (props) => {
      var _a;
      return ((_a = props._origin.memory.state) == null ? void 0 : _a["twitter-last-sent"]) <= Date.now() - 3 * MIN_IN_MSEC;
    }
  },
  effects: {
    "twitter-last-sent": {
      // value: (props) => false,
      value: (props) => {
        var _a;
        return ((_a = props._origin.memory.state) == null ? void 0 : _a["twitter-last-sent"]) <= Date.now() - 3 * MIN_IN_MSEC;
      },
      trigger: (props) => __async(void 0, null, function* () {
        props._origin.memory.state["twitter-last-sent"] = Date.now();
        return {
          success: true,
          payload: void 0
        };
      })
    }
  },
  actions: {
    "twitter-send-message": (props) => __async(void 0, null, function* () {
      try {
        let messages = [];
        let firstMessageInThread = false;
        const message = {
          from_id: "SELF",
          // TODO: Do something else...
          message: "What are you thinking about today?"
        };
        if (!props._origin.clients["twitter"].getMessageThreads().includes(`twitter-${message.from_id}`)) {
          props._origin.clients["twitter"].addMessageThread(
            `twitter-${message.from_id}`
          );
          firstMessageInThread = true;
        }
        if (firstMessageInThread) {
          messages = [
            new SystemMessage(props._origin.config.bio.join("\n")),
            new HumanMessage(message.message)
          ];
        } else {
          message.message = "Could you elaborate?";
          messages = [new HumanMessage(message.message)];
        }
        const response = yield props._origin.model.getMessagesResponse(
          messages,
          {
            thread: `twitter-${message.from_id}`
          }
        );
        yield props._origin.clients["twitter"].sendMessage(response);
        return {
          success: true,
          payload: response
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
  twitter_send_message_default as default
};
