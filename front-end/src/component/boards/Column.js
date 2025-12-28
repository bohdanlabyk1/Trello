import React, { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import Task from './Task';
import { useProjectStore } from './apiboardc';
import './../style/style.css';

const Column = ({ column, tasks, isDragDisabled }) => {
  const {
    updateColumnTitle,
    deleteColumn,
    addTask,
    updateColumnColor
  } = useProjectStore();

  const [title, setTitle] = useState(column.title);
  const [menuOpen, setMenuOpen] = useState(false);
  const [addingTask, setAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
   await addTask({
  title: newTaskTitle,
  columnId: column.id,
});

    setNewTaskTitle('');
    setAddingTask(false);
  };

  return (
    <div
      className="column"
      style={{ border: `4px solid ${column.color || '#3b82f6'}` }}
    >
      {/* ===== HEADER ===== */}
      <div className="column-header">
        <input
          className="title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => updateColumnTitle(column.id, title)}
        />

        <input
          type="color"
          value={column.color || '#3b82f6'}
          onChange={(e) => updateColumnColor(column.id, e.target.value)}
        />

        <button onClick={() => setMenuOpen(p => !p)}>⋮</button>

        {menuOpen && (
          <div className="menu-dropdown">
            <button onClick={() => deleteColumn(column.id)}>
              Delete Column
            </button>
          </div>
        )}
      </div>

      {/* ===== TASKS ===== */}
      <Droppable droppableId={String(column.id)} type="TASK">
        {(provided) => (
          <div
            className="task-list"
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{ minHeight: 50 }}
          >
            {tasks.map((task, index) => (
              <Draggable
                key={task.id}
                draggableId={String(task.id)}
                index={index}
                isDragDisabled={isDragDisabled}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={provided.draggableProps.style}
                  >
                    <Task task={task} columnId={column.id} />
                  </div>
                )}
              </Draggable>
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* ===== ADD TASK ===== */}
      <div className="add-task-plus">
        {addingTask ? (
          <input
            autoFocus
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            onBlur={() => setAddingTask(false)}
          />
        ) : (
          <button onClick={() => setAddingTask(true)}>
            ＋ Add Task
          </button>
        )}
      </div>
    </div>
  );
};

export default Column;
