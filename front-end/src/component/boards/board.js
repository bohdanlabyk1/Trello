import React, { useEffect, useMemo } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from './Column';
import { useProjectStore } from './apiboardc';

const Board = ({ projectId }) => {
  const {
    columns,
    tasks,
    loadProjectData,
    moveTaskLocally,
    moveTask,
    token,
  } = useProjectStore();

  useEffect(() => {
    if (token && projectId) {
      loadProjectData(projectId);
    }
  }, [token, projectId]);

  const onDragEnd = async ({ source, destination, draggableId }) => {
    if (!destination) return;

    const fromCol = Number(source.droppableId);
    const toCol = Number(destination.droppableId);
    const taskId = Number(draggableId);

    if (fromCol === toCol && source.index === destination.index) return;

    const task = tasks[fromCol]?.find(t => t.id === taskId);
    if (!task) return;

    moveTaskLocally(fromCol, toCol, task, destination.index);

    moveTask(fromCol, taskId, toCol, destination.index);
  };

  const visibleColumns = useMemo(() => {
    return columns.map(col => ({
      ...col,
      visibleTasks: tasks[col.id] || [],
    }));
  }, [columns, tasks]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: 'flex', gap: 16 }}>
        {visibleColumns.map(col => (
          <Column
            key={col.id}
            column={col}
            tasks={col.visibleTasks}
          />
        ))}
      </div>
    </DragDropContext>
  );
};

export default Board;