import React, { useEffect, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from './Column';
import { useProjectStore } from './apiboardc';
import * as api from './../api/api';

const Board = ({ projectId }) => {
  const { token, columns, tasks, loadColumns, moveTaskLocally, addColumn } = useProjectStore();
  const [newColumnTitle, setNewColumnTitle] = useState('');

  useEffect(() => {
    if (token && projectId) loadColumns();
  }, [token, projectId]);

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const task = tasks[source.droppableId].find(t => String(t.id) === String(draggableId));
    moveTaskLocally(source.droppableId, destination.droppableId, task, destination.index);

    try {
      await api.moveTask(token, draggableId, destination.droppableId, destination.index);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddColumn = async () => {
    if (!newColumnTitle.trim()) return;
    await addColumn(newColumnTitle);
    setNewColumnTitle('');
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
        <input
          placeholder="New column title"
          value={newColumnTitle}
          onChange={(e) => setNewColumnTitle(e.target.value)}
        />
        <button onClick={handleAddColumn}>Add Column</button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: 'flex', gap: '16px' }}>
          {columns.map(col => (
            <Column
              key={col.id}
              column={col}
              tasks={tasks[col.id] || []}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Board;
