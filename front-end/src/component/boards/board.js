import React, { useEffect, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from './Column';
import './Board.css';
import { useBoardStore } from './apiboardc';
import * as api from './../api/api';

const Board = ({ token, projectId }) => {
  const { columns, tasks, loadColumns, moveTaskLocally, addColumn } = useBoardStore();
  const [newColumnTitle, setNewColumnTitle] = useState('');

  useEffect(() => {
    if (token && projectId) {
      loadColumns(token, projectId);
    }
  }, [token, projectId, loadColumns]);

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const task = tasks[source.droppableId].find(t => String(t.id) === String(draggableId));
    moveTaskLocally(source.droppableId, destination.droppableId, task, destination.index);

    await api.moveTask(token, draggableId, destination.droppableId, destination.index);
  };

  const handleAddColumn = async () => {
    if (!newColumnTitle) return;
    await addColumn(token, newColumnTitle, projectId);
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
              token={token}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Board;
