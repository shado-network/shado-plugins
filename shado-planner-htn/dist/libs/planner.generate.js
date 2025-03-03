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
export {
  generatePlans
};
