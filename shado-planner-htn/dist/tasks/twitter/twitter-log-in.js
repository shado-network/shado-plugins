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

// src/libs/constants.ts
var SEC_IN_MSEC = 1e3;
var MIN_IN_MSEC = 60 * SEC_IN_MSEC;
var HOUR_IN_MSEC = 60 * MIN_IN_MSEC;
var DAY_IN_MSEC = 24 * HOUR_IN_MSEC;

// src/tasks/twitter/twitter-log-in.ts
var twitter_log_in_default = {
  identifier: "twitter-log-in",
  description: "Log in to Twitter.",
  conditions: {
    "twitter-has-client": (props) => {
      var _a;
      return ((_a = props._origin.memory.state) == null ? void 0 : _a["twitter-has-client"]) === true;
    },
    "twitter-has-logged-in": (props) => {
      var _a;
      return ((_a = props._origin.memory.state) == null ? void 0 : _a["twitter-has-logged-in"]) === false;
    },
    "twitter-last-log-in": (props) => {
      var _a;
      return ((_a = props._origin.memory.state) == null ? void 0 : _a["twitter-last-log-in-attempt"]) <= Date.now() - 1 * MIN_IN_MSEC;
    }
  },
  effects: {
    "twitter-has-logged-in": {
      value: (props) => true,
      trigger: (props) => __async(void 0, null, function* () {
        props._origin.memory.state["twitter-has-logged-in"] = true;
        return {
          success: true,
          payload: void 0
        };
      })
    },
    "twitter-last-log-in-attempt": {
      value: (props) => {
        var _a;
        return ((_a = props._origin.memory.state) == null ? void 0 : _a["twitter-log-in-try"]) <= Date.now() - 1 * MIN_IN_MSEC;
      },
      trigger: (props) => __async(void 0, null, function* () {
        props._origin.memory.state["twitter-last-log-in-attempt"] = Date.now();
        return {
          success: true,
          payload: void 0
        };
      })
    }
  },
  actions: {
    "twitter-log-in": (props) => __async(void 0, null, function* () {
      props._origin.memory.state["twitter-last-log-in-attempt"] = Date.now();
      try {
        const result = yield props._origin.clients["twitter"].login();
        if (result === true) {
          return {
            success: true,
            payload: void 0
          };
        } else {
          return {
            success: false,
            payload: void 0
          };
        }
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
  twitter_log_in_default as default
};
