import React, { useState, useEffect } from 'react';
import CommentList from './coments';
import './Board.css';
import { useProjectStore } from './apiboardc';

const Task = ({ task, token, columnId }) => {
  const { updateTask, deleteTaskById, loadComments, comments } = useProjectStore();
  const [showComments, setShowComments] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

 useEffect(() => {
  if (showComments) {
    loadComments(token, task.id);
  }
}, [showComments, token, task.id, loadComments]);


  const handleUpdateTask = () => updateTask(token, task.id, title, description, columnId);
  const handleDeleteTask = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Token not found. Please log in again.');
    return;
  }
  deleteTaskById(token, task.id, columnId);
};


  return (
    <div style={{ background: 'white', padding: '8px', borderRadius: '8px', marginBottom: '8px' }}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleUpdateTask}
        style={{ width: '100%', fontWeight: 'bold', marginBottom: '4px' }}
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onBlur={handleUpdateTask}
        style={{ width: '100%', marginBottom: '4px' }}
      />
      <button onClick={handleDeleteTask} style={{ marginBottom: '4px' }}>Delete Task</button>
      <button onClick={() => setShowComments(prev => !prev)}>
        {showComments ? 'Hide Comments' : 'Show Comments'}
      </button>
      {showComments && <CommentList taskId={task.id} comments={comments[task.id] || []} token={token} />}
    </div>
  );
};

export default Task;
