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
  const [title, setTitle] = useState(task.title);

  const menuRef = useRef(null);

  // ===== CLOSE MENU ON OUTSIDE CLICK =====
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ===== LOAD COMMENTS =====
  useEffect(() => {
    if (showComments) loadComments(task.id);
  }, [showComments, task.id, loadComments]);

  // ===== DELETE =====
  const handleDelete = async () => {
    await deleteTask(task.id, columnId);
    setMenuOpen(false);
  };

  // ===== LABEL =====
  const handleChangeLabel = async (newLabel) => {
    setLabel(newLabel);
    await updateTask(task.id, columnId, { label: newLabel });
  };

  // ===== TITLE =====
  const handleTitleBlur = async () => {
    if (!title.trim() || title === task.title) return;

    await updateTask(task.id, columnId, { title });
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
    if (e.key === 'Escape') {
      setTitle(task.title);
      e.target.blur();
    }
  };

  return (
    <div className={`task-card priority-${task.priority || 'low'}`}>
      <div className="task-top">
        <div className="task-left">
          {label && <span className={`task-label-dot ${label}`} />}
          <span className="task-icon">📄</span>
          <span className="task-id">{task.id}</span>

          {/* ✅ EDITABLE TITLE */}
          <input
            className="task-title-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={handleTitleKeyDown}
          />
        </div>

        <div
          className="task-menu-button"
          onClick={() => setMenuOpen(prev => !prev)}
        >
          ⋯
        </div>
      </div>

      <div className="task-footer">
        <span className={`task-status ${task.status}`}>
          {statusLabel(task.status)}
        </span>
      </div>

      {menuOpen && (
        <div ref={menuRef} className="task-menu">
          <div
            className="task-menu-item"
            onClick={() => setShowComments(prev => !prev)}
          >
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
              />
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
        <CommentList
          taskId={task.id}
          comments={comments?.[task.id] || []}
        />
      )}
    </div>
  );
};

export default Task;
