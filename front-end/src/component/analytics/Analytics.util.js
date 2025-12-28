// analytics.utils.js

// 1️⃣ Кількість задач у кожній колонці
export const tasksPerColumn = (columns, tasks) => {
  return columns.map(col => ({
    columnId: col.id,
    title: col.title,
    count: (tasks[col.id] || []).length,
  }));
};

// 2️⃣ Скільки задач виконав кожний користувач
export const tasksPerUser = (tasks) => {
  const result = {};

  Object.values(tasks).flat().forEach(task => {
    if (task.assignee?.username && task.status === 'done') {
      result[task.assignee.username] =
        (result[task.assignee.username] || 0) + 1;
    }
  });

  return result;
};

// 3️⃣ Середній час завершення задачі (в годинах)
export const averageTaskCompletionTime = (tasks) => {
  const doneTasks = Object.values(tasks)
    .flat()
    .filter(t => t.status === 'done' && t.createdAt && t.completedAt);

  if (!doneTasks.length) return 0;

  const totalTime = doneTasks.reduce((sum, task) => {
    const start = new Date(task.createdAt);
    const end = new Date(task.completedAt);
    return sum + (end - start);
  }, 0);

  return Math.round(totalTime / doneTasks.length / 1000 / 60 / 60);
};

// 4️⃣ Продуктивність по спринтах
export const sprintProductivity = (sprints, tasks) => {
  return sprints.map(sprint => {
    const sprintTasks = Object.values(tasks)
      .flat()
      .filter(t => t.sprintId === sprint.id);

    const done = sprintTasks.filter(t => t.status === 'done').length;

    return {
      sprint: sprint.name,
      total: sprintTasks.length,
      done,
    };
  });
};
