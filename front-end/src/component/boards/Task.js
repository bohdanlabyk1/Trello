import React, { useState, useEffect } from 'react';
import CommentList from './coments';
import './Board.css';
import { useProjectStore } from './apiboardc';

const Task = ({ task, columnId }) => {
  const { updateTask, deleteTask, loadComments, comments } = useProjectStore();
  const [showComments, setShowComments] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  useEffect(() => {
    if (showComments) loadComments(task.id);
  }, [showComments, task.id, loadComments]);

  const handleUpdateTask = () => updateTask(task.id, columnId, title, description);
  const handleDeleteTask = () => deleteTask(task.id, columnId);

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
      {showComments && <CommentList taskId={task.id} comments={comments[task.id] || []} />}
    </div>
  );
};

export default Task;
