import React, { useState, useEffect, useRef } from 'react';
import CommentList from './coments';
import { useProjectStore } from './apiboardc';
import './../style/task.css';

const statusLabel = (status) => {
  switch (status) {
    case 'todo': return 'To Do';
    case 'in-progress': return 'In Progress';
    case 'review': return 'Review';
    case 'done': return 'Done';
    default: return status;
  }
};

const labelColors = ['green', 'red', 'yellow'];

const Task = ({ task, columnId }) => {
  const { deleteTask, loadComments, comments, updateTask } = useProjectStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [label, setLabel] = useState(task.label || '');
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (showComments) loadComments(task.id);
  }, [showComments, task.id, loadComments]);

  const handleDelete = async () => {
    await deleteTask(task.id, columnId);
    setMenuOpen(false);
  };

  const handleChangeLabel = async (newLabel) => {
    setLabel(newLabel);
    await updateTask(
      task.id,
      columnId,
      task.title,
      task.description,
      task.priority,
      task.status,
      task.sprintId,
      newLabel
    );
  };

  return (
    <div className={`task-card priority-${task.priority || 'low'}`}>
      <div className="task-top">
        <div className="task-left">
          {/* Кружечок мітки зліва */}
          {label && <span className={`task-label-dot ${label}`}></span>}
          <span className="task-icon">📄</span>
          <span className="task-id">{task.id}</span>
          <span className="task-title">{task.title}</span>
        </div>

        {/* Кнопка меню */}
        <div className="task-menu-button" onClick={() => setMenuOpen(prev => !prev)}>⋯</div>
      </div>

      <div className="task-footer">
        <span className={`task-status ${task.status}`}>{statusLabel(task.status)}</span>
      </div>

      {menuOpen && (
        <div ref={menuRef} className="task-menu">
          <div className="task-menu-item" onClick={() => setShowComments(prev => !prev)}>
            💬 {showComments ? 'Hide comments' : 'Show comments'}
          </div>

          <div className="task-menu-item label-selector">
            🎨 Change label:
            {labelColors.map(color => (
              <span
                key={color}
                className={`task-label-dot ${color}`}
                style={{
                  marginLeft: 6,
                  cursor: 'pointer',
                  border: label === color ? '2px solid black' : ''
                }}
                onClick={() => handleChangeLabel(color)}
              ></span>
            ))}
            <span
              style={{
                marginLeft: 6,
                cursor: 'pointer',
                padding: '0 4px',
                border: '1px dashed #6b778c',
                borderRadius: '50%'
              }}
              onClick={() => handleChangeLabel('')}
            >
              ×
            </span>
          </div>

          <div className="task-menu-item delete" onClick={handleDelete}>
            🗑 Delete task
          </div>
        </div>
      )}

      {showComments && (
        <CommentList taskId={task.id} comments={comments[task.id] || []} />
      )}
    </div>
  );
};

export default Task;
