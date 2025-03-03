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

// src/tasks/telegram/telegram-read-messages.ts
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

// src/libs/constants.ts
var SEC_IN_MSEC = 1e3;
var MIN_IN_MSEC = 60 * SEC_IN_MSEC;
var HOUR_IN_MSEC = 60 * MIN_IN_MSEC;
var DAY_IN_MSEC = 24 * HOUR_IN_MSEC;

// src/tasks/telegram/telegram-read-messages.ts
var telegram_read_messages_default = {
  identifier: "telegram-read-messages",
  description: "Reply to retrieved Telegram messages.",
  conditions: {
    "telegram-has-client": (props) => {
      var _a;
      return ((_a = props._origin.memory.state) == null ? void 0 : _a["telegram-has-client"]) === true;
    },
    "telegram-has-messages": (props) => {
      var _a;
      return ((_a = props._origin.memory.state) == null ? void 0 : _a["telegram-has-messages"]) === true;
    },
    "telegram-last-replied": (props) => {
      var _a;
      return ((_a = props._origin.memory.state) == null ? void 0 : _a["telegram-last-replied"]) <= Date.now() - 1 * SEC_IN_MSEC;
    }
  },
  effects: {
    "telegram-has-messages": {
      value: (props) => false,
      trigger: (props) => __async(void 0, null, function* () {
        props._origin.memory.state["telegram-messages"] = [];
        props._origin.memory.state["telegram-has-messages"] = false;
        return {
          success: true,
          payload: void 0
        };
      })
    },
    "telegram-last-replied": {
      value: (props) => {
        var _a;
        return ((_a = props._origin.memory.state) == null ? void 0 : _a["telegram-last-replied"]) <= Date.now() - 1 * SEC_IN_MSEC;
      },
      trigger: (props) => __async(void 0, null, function* () {
        props._origin.memory.state["telegram-last-replied"] = Date.now();
        return {
          success: true,
          payload: void 0
        };
      })
    }
  },
  actions: {
    "telegram-read-messages": (props) => __async(void 0, null, function* () {
      var _a;
      try {
        const replied = [];
        let messages = [];
        let firstMessageInThread = false;
        (_a = props._origin.memory.state) == null ? void 0 : _a["telegram-messages"].forEach(
          (message) => __async(void 0, null, function* () {
            if (message.is_read) {
              return;
            }
            props._origin.clients["telegram"].markAsRead(message.id);
            props._context.utils.logger.send({
              type: "LOG",
              origin: {
                type: "AGENT",
                id: props._origin.id
              },
              data: {
                message: "Got a Telegram message",
                payload: { message: message.text }
              }
            });
            if (!_shouldReplyToMessage(
              props,
              message.metadata.chat.type,
              message.text
            )) {
              props._context.utils.logger.send({
                type: "LOG",
                origin: {
                  type: "AGENT",
                  id: props._origin.id
                },
                data: {
                  message: "Chose to ignore Telegram message:",
                  payload: { message: message.text }
                }
              });
              replied.push(false);
              return;
            }
            if (!props._origin.clients["telegram"].getMessageThreads().includes(`telegram-${message.from.id}`)) {
              props._origin.clients["telegram"].addMessageThread(
                `telegram-${message.from.id}`
              );
              firstMessageInThread = true;
            }
            if (firstMessageInThread) {
              messages = [
                new SystemMessage(props._origin.config.bio.join("\n")),
                new HumanMessage(message.text)
              ];
            } else {
              messages = [new HumanMessage(message.text)];
            }
            const response = yield props._origin.model.getMessagesResponse(messages, {
              thread: `telegram-${message.from.id}`
            });
            yield props._origin.clients["telegram"].replyToMessage(
              response,
              message.metadata.replyFn
            );
            replied.push(true);
          })
        );
        return {
          success: true,
          payload: void 0
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
var _shouldReplyToMessage = (props, chatType, messageText) => {
  const isInPrivateChat = chatType === "private";
  const isMentioned = messageText.includes(
    `@${process.env[`TELEGRAM_${props._origin.id.toUpperCase()}_BOT_HANDLE`]}`
  ) || messageText.includes(
    `${process.env[`TELEGRAM_${props._origin.id.toUpperCase()}_BOT_HANDLE`]}`
  ) || messageText.includes(`${props._origin.name}`);
  const checks = [
    isInPrivateChat,
    isMentioned
    // isFromSwarmPuppet
  ];
  if (checks.some((filter) => filter)) {
    return true;
  }
  return false;
};
export {
  telegram_read_messages_default as default
};
