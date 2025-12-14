import React, { useEffect, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from './Column';
import { useProjectStore } from './apiboardc';
import * as api from './../api/api';

const Board = ({ projectId }) => {
  const store = useProjectStore();

  const {
    token,
    columns,
    tasks,
    sprints,
    selectedSprintId,
    setSelectedSprintId,
    loadColumns,
    loadSprints,
    addColumn,
    moveTaskLocally,
  } = store;

  const [newColumnTitle, setNewColumnTitle] = useState('');

  useEffect(() => {
    if (!token || !projectId) return;

    loadColumns(projectId);
    loadSprints();
  }, [token, projectId]);

  const onDragEnd = async ({ source, destination, draggableId }) => {
    if (!destination) return;

    const sourceColId = String(source.droppableId);
    const destColId = String(destination.droppableId);

    if (
      sourceColId === destColId &&
      source.index === destination.index
    ) return;

    const task = (tasks[sourceColId] || []).find(
      t => String(t.id) === draggableId
    );
    if (!task) return;

    moveTaskLocally(sourceColId, destColId, task, destination.index);

    try {
      await api.moveTask(
        token,
        task.id,
        Number(destColId),
        destination.index
      );
    } catch {}
  };

  return (
    <div>
      {/* TOP */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <label>Sprint:</label>

      <select
  value={selectedSprintId}
  onChange={(e) => setSelectedSprintId(e.target.value)}
>
  <option value="all">All tasks</option>
  <option value="no-sprint">No Sprint</option>
  {sprints.map(s => (
    <option key={s.id} value={String(s.id)}>
      {s.name}
    </option>
  ))}
</select>


        <input
          placeholder="New column title"
          value={newColumnTitle}
          onChange={(e) => setNewColumnTitle(e.target.value)}
        />
        <button onClick={() => {
          if (newColumnTitle.trim()) {
            addColumn(newColumnTitle.trim());
            setNewColumnTitle('');
          }
        }}>
          Add Column
        </button>
      </div>

      {/* BOARD */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: 'flex', gap: 16 }}>
          {columns.map(col => {
            const columnTasks = tasks[String(col.id)] || [];

            const filteredTasks = columnTasks.filter(task => {
              if (!selectedSprintId) return true;
              if (selectedSprintId === 'no-sprint') return !task.sprintId;
              return task.sprintId === Number(selectedSprintId);
            });

            return (
              <Column
                key={col.id}
                column={col}
                tasks={filteredTasks}
              />
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Board;
