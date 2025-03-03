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
export {
  executePlan
};
