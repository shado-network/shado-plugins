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

// src/libs/utils.tasks.ts
import fs from "fs";
import path from "path";

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

// src/libs/utils.tasks.ts
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
export {
  importTasks
};
