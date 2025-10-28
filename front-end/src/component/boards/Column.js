import React, { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import Task from './Task';
import { useProjectStore } from './apiboardc';

const Column = ({ column, tasks }) => {
  const { updateColumnTitle, deleteColumn, addTask } = useProjectStore();
  const [title, setTitle] = useState(column.title);
  const [menuOpen, setMenuOpen] = useState(false);

  const [addingTask, setAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleUpdateColumn = () => {
    if (title.trim()) updateColumnTitle(column.id, title);
  };

  const handleDeleteColumn = () => {
    deleteColumn(column.id);
    setMenuOpen(false);
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    addTask(column.id, newTaskTitle);
    setNewTaskTitle('');
    setAddingTask(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAddTask();
    else if (e.key === 'Escape') {
      setAddingTask(false);
      setNewTaskTitle('');
    }
  };

  return (
    <div className="column">
      <div className="column-header">
        <input
          className="title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleUpdateColumn}
        />
        <div className="menu-wrapper">
          <button className="menu-button" onClick={() => setMenuOpen(prev => !prev)}>⋮</button>
          {menuOpen && (
            <div className="menu-dropdown">
              <button onClick={handleDeleteColumn} className="menu-item">Delete Column</button>
            </div>
          )}
        </div>
      </div>

      <Droppable droppableId={String(column.id)}>
        {(provided) => (
          <div className="task-list" ref={provided.innerRef} {...provided.droppableProps}>
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                    <Task task={task} columnId={column.id} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <div className="add-task-plus">
        {addingTask ? (
          <input
            autoFocus
            placeholder="Enter task title..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => { if (!newTaskTitle.trim()) setAddingTask(false); }}
          />
        ) : (
          <button onClick={() => setAddingTask(true)}>＋ Add Task</button>
        )}
      </div>
    </div>
  );
};

export default Column;
