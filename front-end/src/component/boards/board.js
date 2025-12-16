import React, { useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from './Column';
import { useProjectStore } from './apiboardc';

const Board = ({ projectId }) => {
  const {
    token,
    columns,
    tasks,
    loadColumns,
    moveTaskLocally,
    moveTask,
  } = useProjectStore();

  useEffect(() => {
    if (token && projectId) {
      loadColumns(projectId);
    }
  }, [token, projectId, loadColumns]);

  const onDragEnd = async ({ source, destination, draggableId }) => {
    if (!destination) return;

    const fromColId = source.droppableId;
    const toColId = destination.droppableId;

    if (
      fromColId === toColId &&
      source.index === destination.index
    ) return;

    const task = (tasks[fromColId] || []).find(
      t => String(t.id) === draggableId
    );

    if (!task) return;

    // 1️⃣ оптимістично оновлюємо UI
    moveTaskLocally(fromColId, toColId, task, destination.index);

    // 2️⃣ зберігаємо в БД
    try {
      await moveTask(
        task.id,
        Number(toColId),
        destination.index
      );
    } catch (e) {
      console.error('Move task failed', e);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: 'flex', gap: 16 }}>
        {columns.map(col => (
          <Column
            key={col.id}
            column={col}
            tasks={tasks[col.id] || []}
          />
        ))}
      </div>
    </DragDropContext>
  );
};

export default Board;
