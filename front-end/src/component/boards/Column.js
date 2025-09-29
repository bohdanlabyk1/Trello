import React, { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import Task from './Task';
import { useBoardStore } from './apiboardc';

const Column = ({ column, tasks, token }) => {
  const { updateColumnTitle, deleteColumnById, addTask } = useBoardStore();
  const [title, setTitle] = useState(column.title);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');

  const handleUpdateColumn = () => {
    if (title) updateColumnTitle(token, column.id, title);
  };

  const handleDeleteColumn = () => deleteColumnById(token, column.id);

  const handleAddTask = () => {
    if (!newTaskTitle) return;
    addTask(token, newTaskTitle, newTaskDesc, column.id);
    setNewTaskTitle('');
    setNewTaskDesc('');
  };

  return (
    <div className="column" style={{ background: "#ebecf0", padding: "10px", borderRadius: "8px", minWidth: "250px" }}>
      <input
        className="title-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleUpdateColumn}
        style={{ fontWeight: "bold", marginBottom: "8px" }}
      />
      <button onClick={handleDeleteColumn}>Delete Column</button>

      {/* Droppable для задач */}
     <Droppable droppableId={String(column.id)}>
  {(provided) => (
    <div
      ref={provided.innerRef}
      {...provided.droppableProps}
      style={{ minHeight: "20px" }}
    >
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

      <div className="add-task">
        <input
          placeholder="Task title"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <input
          placeholder="Task description"
          value={newTaskDesc}
          onChange={(e) => setNewTaskDesc(e.target.value)}
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>
    </div>
  );
};

export default Column;
