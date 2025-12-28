import React from 'react';
import { useProjectStore } from './../boards/apiboardc';
import Task from './../boards/Task';

const SprintTasks = ({ sprint, onBack }) => {
  const tasks = useProjectStore(state => state.tasks ?? {});

  if (!sprint) {
    return (
      <div>
        <button onClick={onBack}>← Назад</button>
        <p>Спринт не знайдений</p>
      </div>
    );
  }

  // ✅ Всі задачі спринту
  const sprintTasks = Object.values(tasks)
    .flat()
    .filter(t => t.sprintId === sprint.id);

  return (
    <div className="sprint-tasks">
      <button onClick={onBack}>← Назад</button>
      <h2>{sprint.name}</h2>

      {sprintTasks.length === 0 ? (
        <p>Немає задач у цьому спринті</p>
      ) : (
        sprintTasks.map(task => (
          <Task key={task.id} task={task} columnId={task.columnId} />
        ))
      )}
    </div>
  );
};

export default SprintTasks;
