var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
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
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
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
import path2 from "path";

// src/tasks/index.ts
var tasksPool = (_origin, _tasks) => {
  const pool = [];
  const clientsArray = _origin._register.clients.forEach((client) => {
    try {
      pool.push(
        ...Object.values(
          _tasks[client.plugin.metadata.key]
        )
      );
    } catch (error) {
    }
  });
  return pool;
};

// src/states/telegram.ts
var telegramDefaultState = {
  "telegram-last-updated": 0,
  //
  "telegram-has-messages": false,
  "telegram-messages": [],
  "telegram-last-replied": 0
};

// src/states/twitter.ts
var twitterDefaultState = {
  "twitter-last-updated": 0,
  //
  "twitter-has-logged-in": false,
  "twitter-last-log-in-attempt": 0,
  // 'twitter-has-messages': false,
  // 'twitter-messages': [],
  "twitter-last-sent": 0
  // 'twitter-last-replied': 0,
};

// src/states/index.ts
var defaultStates = {
  telegram: __spreadValues({}, telegramDefaultState),
  twitter: __spreadValues({}, twitterDefaultState)
};

// src/libs/constants.ts
var SEC_IN_MSEC = 1e3;
var MIN_IN_MSEC = 60 * SEC_IN_MSEC;
var HOUR_IN_MSEC = 60 * MIN_IN_MSEC;
var DAY_IN_MSEC = 24 * HOUR_IN_MSEC;

// src/libs/async.ts
var asyncForEach = (array, callback) => __async(void 0, null, function* () {
  for (let i = 0; i < array.length; i++) {
    yield callback(array[i], i, array);
  }
});
var _asyncFilter = (array, callback) => __async(void 0, null, function* () {
  return Promise.all(array.map(callback)).then((results) => {
    return array.filter((_value, index) => {
      return results[index];
    });
  });
});
var asyncEvery = (array, callback) => __async(void 0, null, function* () {
  return (yield _asyncFilter(array, callback)).length === array.length;
});
var asyncSleep = (seconds) => __async(void 0, null, function* () {
  return new Promise((resolve) => {
    return setTimeout(resolve, seconds * SEC_IN_MSEC);
  });
});

// src/libs/planner.generate.ts
var generatePlans = (tasksPool2, _origin, _context) => __async(void 0, null, function* () {
  const plans = [];
  const goalsReached = [];
  const goalsUnreached = [];
  _origin.memory.goals.forEach((goal) => {
    const goalResult = goal.evaluator({
      _origin,
      _context
    });
    if (goalResult) {
      goalsReached.push(goal);
    } else {
      goalsUnreached.push(goal);
    }
  });
  _origin.events.emit("planner", {
    timestamp: Date.now(),
    origin: "shado-planner-htn",
    data: {
      identifier: "puppetGoals",
      goals: {
        reached: goalsReached,
        unreached: goalsUnreached
      }
    }
  });
  if (goalsUnreached.length === 0) {
    return plans;
  }
  yield asyncForEach(goalsUnreached, (goal) => __async(void 0, null, function* () {
    const relatedTasks = tasksPool2.filter((task) => {
      return Boolean(task.effects[goal.identifier]);
    });
    if (relatedTasks.length === 0) {
      return;
    }
    const tempPlans = [];
    yield asyncForEach(
      // NOTE: Just pick first related task for now.
      [relatedTasks.at(0)],
      (relatedTask) => __async(void 0, null, function* () {
        const tempPlan = yield _recursivePlanner(
          true,
          relatedTask,
          [],
          tasksPool2,
          _origin,
          _context
        );
        if (tempPlan && tempPlan !== null && tempPlan.length > 0) {
          tempPlans.push(tempPlan);
        }
      })
    );
    plans.push(...tempPlans);
  }));
  return plans;
});
var _recursivePlanner = (success, currentTask, currentPlan, tasksPool2, _origin, _context) => __async(void 0, null, function* () {
  if (!success) {
    success = false;
    return null;
  }
  if (!currentTask) {
    success = false;
    return null;
  }
  const conditionsMet = [];
  const conditionsUnmet = [];
  Object.keys(currentTask.conditions).forEach((conditionIdentifier) => {
    const conditionResult = currentTask.conditions[conditionIdentifier]({
      _origin: __spreadValues({}, _origin),
      _context
    });
    if (conditionResult) {
      conditionsMet.push(conditionIdentifier);
    } else {
      conditionsUnmet.push(conditionIdentifier);
    }
  });
  if (conditionsUnmet.length === 0) {
    success = true;
    return [currentTask];
  }
  conditionsUnmet.forEach((conditionIdentifier) => __async(void 0, null, function* () {
    const relatedTasks = tasksPool2.filter((relatedTask) => {
      var _a;
      const effectValue = (_a = relatedTask.effects[conditionIdentifier]) == null ? void 0 : _a.value({
        _origin: __spreadValues({}, _origin),
        _context
      });
      return Object.keys(relatedTask.effects).includes(conditionIdentifier) && effectValue;
    });
    if (relatedTasks.length === 0) {
      success = false;
      return null;
    }
    currentPlan.push(relatedTasks[0]);
    return yield _recursivePlanner(
      success,
      // NOTE: Just pick first related task for now.
      relatedTasks[0],
      currentPlan,
      tasksPool2,
      _origin,
      _context
    );
  }));
  if (!success) {
    success = false;
    return [];
  }
  success = true;
  return [currentTask, ...currentPlan].reverse();
});

// src/libs/planner.execute.ts
var executePlan = (plan, _origin, _context) => __async(void 0, null, function* () {
  _origin.events.emit("planner", {
    timestamp: Date.now(),
    origin: "shado-planner-htn",
    data: {
      identifier: "puppetPlan",
      plan
    }
  });
  const result = yield asyncEvery(plan, (task) => __async(void 0, null, function* () {
    _context.utils.logger.send({
      type: "LOG",
      origin: {
        type: "PUPPET",
        id: _origin.id
      },
      data: {
        message: `Executing task "${task.identifier}"`
        // payload: {
        //   task,
        //   // state
        // },
      }
    });
    if (!Object.keys(task.conditions).every((conditionIdentifier) => {
      return task.conditions[conditionIdentifier]({
        _origin,
        _context
      });
    })) {
      _context.utils.logger.send({
        type: "WARNING",
        origin: {
          type: "PUPPET",
          id: _origin.id
        },
        data: {
          message: `Task "${task.identifier}" skipped`
        }
      });
      return false;
    }
    const results = [];
    yield asyncForEach(
      Object.keys(task.actions),
      (actionIdentifier) => __async(void 0, null, function* () {
        const result2 = yield task.actions[actionIdentifier]({
          _origin,
          _context
        });
        results.push(result2);
      })
    );
    if (!results.every((result2) => {
      return result2.success;
    })) {
      return false;
    }
    yield asyncForEach(
      Object.keys(task.effects),
      (effectIdentifier) => __async(void 0, null, function* () {
        const result2 = yield task.effects[effectIdentifier].trigger({
          _origin,
          _context
        });
      })
    );
    return true;
  }));
  return result;
});

// src/libs/planner.loop.ts
var config = {
  AWAIT_PLANNING_FOR_X_SECONDS: 1,
  RETRY_PLANNING_IN_X_SECONDS: 5
};
var plannerLoop = (tasksPool2, _origin, _context) => __async(void 0, null, function* () {
  const date = /* @__PURE__ */ new Date();
  _origin.memory.state["last-updated"] = date.valueOf();
  _origin.events.emit("planner", {
    timestamp: Date.now(),
    origin: "shado-planner-htn",
    data: {
      identifier: "puppetState",
      state: _origin.memory.state
    }
  });
  if (!_origin.memory.goals || Object.keys(_origin.memory.goals).length === 0) {
    _context.utils.logger.send({
      type: "LOG",
      origin: {
        type: "PUPPET",
        id: _origin.id
      },
      data: {
        message: "No goals have been set"
        // payload: { state: _origin.memory.state },
      }
    });
    yield asyncSleep(config.RETRY_PLANNING_IN_X_SECONDS);
    plannerLoop(tasksPool2, _origin, _context);
    return;
  }
  const plans = yield generatePlans(tasksPool2, _origin, _context);
  if (!plans || plans.length === 0) {
    _context.utils.logger.send({
      type: "LOG",
      origin: {
        type: "PUPPET",
        id: _origin.id
      },
      data: {
        message: "No plan found for current goals"
        // payload: {
        //   goals: Object.keys(_origin.memory.goals),
        //   state: _origin.memory.state,
        // },
      }
    });
    yield asyncSleep(config.RETRY_PLANNING_IN_X_SECONDS);
    plannerLoop(tasksPool2, _origin, _context);
    return;
  }
  let arePlansExecuted = true;
  yield asyncForEach(plans, (plan) => __async(void 0, null, function* () {
    if (!plan || plan.length === 0) {
      _context.utils.logger.send({
        type: "LOG",
        origin: {
          type: "PUPPET",
          id: _origin.id
        },
        data: {
          message: "No plan found for current goals"
          // payload: {
          //   goals: Object.keys(_origin.memory.goals),
          //   state: _origin.memory.state,
          // },
        }
      });
      yield asyncSleep(config.RETRY_PLANNING_IN_X_SECONDS);
      plannerLoop(tasksPool2, _origin, _context);
      return;
    }
    const isPlanExecuted = yield executePlan(plan, _origin, _context);
    if (!isPlanExecuted) {
      arePlansExecuted = false;
    }
  }));
  if (arePlansExecuted) {
    _context.utils.logger.send({
      type: "INFO",
      origin: {
        type: "PUPPET",
        id: _origin.id
      },
      data: {
        message: "All plans executed successfully"
        // payload: { state: _origin.memory.state },
      }
    });
  } else {
    _context.utils.logger.send({
      type: "WARNING",
      origin: {
        type: "PUPPET",
        id: _origin.id
      },
      data: {
        message: "Some plans skipped"
        // payload: { state: _origin.memory.state },
      }
    });
    yield asyncSleep(config.RETRY_PLANNING_IN_X_SECONDS);
  }
  _origin.events.emit("planner", {
    timestamp: Date.now(),
    origin: "shado-planner-htn",
    data: {
      identifier: "puppetState",
      state: _origin.memory.state
    }
  });
  plannerLoop(tasksPool2, _origin, _context);
});

// src/libs/utils.tasks.ts
import fs from "fs";
import path from "path";
var importTasks = (tasksPath) => __async(void 0, null, function* () {
  const imports = [];
  const files = fs.readdirSync(tasksPath, {
    recursive: true
  });
  console.log("!!!", { files });
  yield asyncForEach(files, (file) => __async(void 0, null, function* () {
    if (!file.endsWith(".js") && !file.endsWith(".ts")) {
      return;
    }
    try {
      const taskPath = path.join(tasksPath, file);
      const task = yield import(taskPath);
      imports.push(task.default);
    } catch (error) {
      console.log("Error loading task", error);
    }
  }));
  return imports;
});

// src/index.ts
var ShadoPlannerHTN = class {
  // | PuppetContext | PlayContext
  constructor(config2, _origin, _context) {
    this.config = {
      // TODO: Implement logger conditional.
      showLogs: true
    };
    this._registerTasks = () => __async(this, null, function* () {
      const tasks = {};
      const __dirname = "/Users/reffan/Desktop/O U T L I E R/Projects/20241123 - Shado Network/dev/shado-plugins/shado-planner-htn/src";
      const tasksPath = path2.join(__dirname, "tasks");
      const imports = yield importTasks(tasksPath);
      imports.forEach((importedTask) => {
        if (!importedTask) {
          return;
        }
        const key = importedTask.identifier.split("-").at(0);
        if (!tasks[key]) {
          tasks[key] = {};
        }
        tasks[key][importedTask.identifier] = importedTask;
      });
      return tasks;
    });
    this.setup = () => __async(this, null, function* () {
      var _a, _b, _c, _d;
      try {
        this._origin.memory.goals = [
          ...this._origin.memory.goals,
          ...this.config.goals
        ];
        this._origin.memory.state = __spreadValues(__spreadProps(__spreadValues(__spreadProps(__spreadValues({
          "last-started": 0,
          "last-updated": 0
        }, this._origin.memory.state), {
          //
          // NOTE: Telegram default state
          "telegram-has-client": Boolean((_a = this._origin.clients) == null ? void 0 : _a["telegram"])
        }), ((_b = this._origin.clients) == null ? void 0 : _b["telegram"]) ? defaultStates["telegram"] : {}), {
          // NOTE: Twitter default state
          "twitter-has-client": Boolean((_c = this._origin.clients) == null ? void 0 : _c["twitter"])
        }), ((_d = this._origin.clients) == null ? void 0 : _d["twitter"]) ? defaultStates["twitter"] : {});
        this._tasks = yield this._registerTasks();
      } catch (error) {
        this._context.utils.logger.send({
          type: "ERROR",
          origin: {
            type: "PUPPET",
            id: this._origin.id
          },
          data: {
            message: `Error in planner initialization`,
            payload: { error }
          }
        });
      }
    });
    this.start = () => {
      const date = /* @__PURE__ */ new Date();
      this._origin.memory.state["last-started"] = date.valueOf();
      this._origin.events.emit("planner", {
        timestamp: Date.now(),
        origin: "shado-planner-htn",
        data: {
          identifier: "puppetState",
          state: this._origin.memory.state
        }
      });
      plannerLoop(
        // TODO: Make it so it stays dynamic?
        tasksPool(this._origin, this._tasks),
        this._origin,
        this._context
      );
    };
    this._context = _context;
    this._origin = _origin;
    this.config = __spreadValues(__spreadValues({}, this.config), config2);
    this._tasks = {};
  }
};
ShadoPlannerHTN.metadata = {
  identifier: "shado-planner-htn",
  description: "Shad\u014D Network's hierarchical task network planner.",
  //
  key: "planner"
};
var index_default = ShadoPlannerHTN;
export {
  index_default as default
};
