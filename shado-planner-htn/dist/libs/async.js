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
var asyncSome = (array, callback) => __async(void 0, null, function* () {
  return (yield _asyncFilter(array, callback)).length > 0;
});
var asyncEvery = (array, callback) => __async(void 0, null, function* () {
  return (yield _asyncFilter(array, callback)).length === array.length;
});
var asyncSleep = (seconds) => __async(void 0, null, function* () {
  return new Promise((resolve) => {
    return setTimeout(resolve, seconds * SEC_IN_MSEC);
  });
});
export {
  asyncEvery,
  asyncForEach,
  asyncSleep,
  asyncSome
};
