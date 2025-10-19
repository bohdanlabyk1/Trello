import React, { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import Task from './Task';
import { useProjectStore } from './apiboardc';
import './Board.css';

const Column = ({ column, tasks, token }) => {
  const { updateColumnTitle, deleteColumnById, addTask } = useProjectStore();
  const [title, setTitle] = useState(column.title);
  const [menuOpen, setMenuOpen] = useState(false);

  // Стан для створення задачі через плюсик
  const [addingTask, setAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleUpdateColumn = () => {
    if (title) updateColumnTitle(token, column.id, title);
  };

  const handleDeleteColumn = () => {
    deleteColumnById(token, column.id);
    setMenuOpen(false);
  };
const handleAddTask = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Token not found. Please log in again.');
    return;
  }

  if (!newTaskTitle.trim()) return;

  addTask(token, newTaskTitle, '', column.id); // передаємо token
  setNewTaskTitle('');
  setAddingTask(false);
};

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddTask();
    } else if (e.key === 'Escape') {
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

        {/* Три крапки */}
        <div className="menu-wrapper">
          <button className="menu-button" onClick={() => setMenuOpen((prev) => !prev)}>
            ⋮
          </button>

          {menuOpen && (
            <div className="menu-dropdown">
              <button onClick={handleDeleteColumn} className="menu-item">
                Delete Column
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Droppable для задач */}
      <Droppable droppableId={String(column.id)}>
        {(provided) => (
          <div className="task-list" ref={provided.innerRef} {...provided.droppableProps}>
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Task task={task} token={token} columnId={column.id} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Плюсик для додавання задач */}
      <div className="add-task-plus">
        {addingTask ? (
          <input
            autoFocus
            placeholder="Enter task title..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              if (!newTaskTitle.trim()) setAddingTask(false);
            }}
          />
        ) : (
          <button onClick={() => setAddingTask(true)}>＋ Add Task</button>
        )}
      </div>
    </div>
  );
};

export default Column;
