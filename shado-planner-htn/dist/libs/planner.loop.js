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
var generatePlans = (tasksPool, _origin, _context) => __async(void 0, null, function* () {
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
    const relatedTasks = tasksPool.filter((task) => {
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
          tasksPool,
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
var _recursivePlanner = (success, currentTask, currentPlan, tasksPool, _origin, _context) => __async(void 0, null, function* () {
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
    const relatedTasks = tasksPool.filter((relatedTask) => {
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
      tasksPool,
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
var plannerLoop = (tasksPool, _origin, _context) => __async(void 0, null, function* () {
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
    plannerLoop(tasksPool, _origin, _context);
    return;
  }
  const plans = yield generatePlans(tasksPool, _origin, _context);
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
    plannerLoop(tasksPool, _origin, _context);
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
      plannerLoop(tasksPool, _origin, _context);
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
  plannerLoop(tasksPool, _origin, _context);
});
export {
  plannerLoop
};
