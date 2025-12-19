import React, { useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from './Column';
import { useProjectStore } from './apiboardc';

const Board = ({ projectId }) => {
  const {
    columns,
    tasks,
    sprints,
    selectedSprintId,
    setSelectedSprintId,
    loadColumns,
    loadSprints,
    moveTaskLocally,
    moveTask,
    token
  } = useProjectStore();

  useEffect(() => {
    if (token && projectId) {
      loadColumns(projectId);
      loadSprints(projectId);
    }
  }, [token, projectId, loadColumns, loadSprints]);

  const onDragEnd = async ({ source, destination, draggableId }) => {
    if (!destination) return;

    const task = tasks[source.droppableId]
      .find(t => t.id === Number(draggableId));

    moveTaskLocally(
      source.droppableId,
      destination.droppableId,
      task,
      destination.index
    );

    await moveTask(task.id, Number(destination.droppableId), destination.index);
  };

  return (
    <>
      {/* ===== SPRINT FILTER ===== */}
      <select
        value={selectedSprintId}
        onChange={e => setSelectedSprintId(e.target.value)}
      >
        <option value="all">All</option>
        <option value="none">Backlog</option>
        {sprints.map(s => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>

      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: 'flex', gap: 16 }}>
          {columns.map(col => (
            <Column
              key={col.id}
              column={col}
              tasks={tasks[col.id] || []}
              selectedSprintId={selectedSprintId}
            />
          ))}
        </div>
      </DragDropContext>
    </>
  );
};
export default Board

