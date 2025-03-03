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
export {
  tasksPool
};
