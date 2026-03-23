import React, { useState, useEffect, useMemo } from 'react';
import { useProjectStore } from './../boards/apiboardc';
import Task from './../boards/Task';
import SprintTasks from './SprintTask';
import './../style/sprint.css';
import * as api from './../api/api';

const Sprint = ({ projectId }) => {
  const token = localStorage.getItem('token');

  const {
    sprints,
    columns,
    tasks,
    loadProjectData,
    addTask,
    deleteSprint,
    searchQuery,
    searchType,
  } = useProjectStore();

  const [newSprint, setNewSprint] = useState({
    name: '',
    startDate: '',
    endDate: '',
  });

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedSprintId, setSelectedSprintId] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [activeSprint, setActiveSprint] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  // ===== Load project =====
  useEffect(() => {
    if (token && projectId) {
      loadProjectData(projectId);
    }
  }, [token, projectId, loadProjectData]);

  // ===== Create sprint =====
  const handleCreateSprint = async () => {
    if (!newSprint.name || !newSprint.startDate || !newSprint.endDate) {
      return alert('Заповни всі поля');
    }

    try {
      await api.createSprint(token, {
        ...newSprint,
        projectId,
      });

      await loadProjectData(projectId);
      setNewSprint({ name: '', startDate: '', endDate: '' });
    } catch (err) {
      console.error(err);
      alert('Не вдалося створити спринт');
    }
  };

  // ===== Create task =====
  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) return alert('Введи назву задачі');
    if (!selectedSprintId) return alert('Спринт не вибраний');
    if (!columns.length) return alert('Колонки ще не завантажені');

    const firstColumn = columns.find(c => c.order === 0) || columns[0];
    if (!firstColumn) return alert('Колонка не знайдена');

    await addTask({
      title: newTaskTitle,
      columnId: firstColumn.id,
      sprintId: selectedSprintId,
    });

    setNewTaskTitle('');
    setShowTaskModal(false);
    setSelectedSprintId(null);
  };

  // ===== All tasks =====
  const allTasks = useMemo(
    () => Object.values(tasks).flat(),
    [tasks]
  );

  // ===== Progress =====
  const calculateProgress = sprint => {
    const sprintTasks = allTasks.filter(t => t.sprintId === sprint.id);
    if (!sprintTasks.length) return 0;

    const done = sprintTasks.filter(t => t.status === 'done').length;
    return Math.round((done / sprintTasks.length) * 100);
  };

  // ===== 🔍 FILTER SPRINTS =====
  const filteredSprints = useMemo(() => {
    if (searchType !== 'sprint' || !searchQuery.trim()) {
      return sprints;
    }

    return sprints.filter(sprint =>
      sprint.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sprints, searchQuery, searchType]);

  // ===== Sprint details =====
  if (activeSprint) {
    return (
      <SprintTasks
        sprint={activeSprint}
        tasks={tasks}
        onBack={() => setActiveSprint(null)}
      />
    );
  }

  return (
    <div className="sprint-container">
      <h2>Спринти проєкту #{projectId}</h2>

      {/* ===== Create sprint ===== */}
      <div className="sprint-form">
        <input
          placeholder="Назва спринта"
          value={newSprint.name}
          onChange={e =>
            setNewSprint({ ...newSprint, name: e.target.value })
          }
        />
        <input
          type="date"
          value={newSprint.startDate}
          onChange={e =>
            setNewSprint({ ...newSprint, startDate: e.target.value })
          }
        />
        <input
          type="date"
          value={newSprint.endDate}
          onChange={e =>
            setNewSprint({ ...newSprint, endDate: e.target.value })
          }
        />
        <button onClick={handleCreateSprint}>
          ➕ Створити спринт
        </button>
      </div>

      {/* ===== Sprint list ===== */}
      <div className="sprint-list">
        {filteredSprints.length === 0 ? (
          <p>Нічого не знайдено 😢</p>
        ) : (
          filteredSprints.map(sprint => {
            const sprintTasks = allTasks.filter(
              t => t.sprintId === sprint.id
            );

            return (
              <div key={sprint.id} className="sprint-card">
              <div className="sprint-header">
  <h3 onClick={() => setActiveSprint(sprint)}>
    {sprint.name}
  </h3>

  <div className="sprint-menu">
    <button
      className="menu-btn"
      onClick={() =>
        setOpenMenuId(
          openMenuId === sprint.id ? null : sprint.id
        )
      }
    >
      ⋮
    </button>

    {openMenuId === sprint.id && (
      <div className="menu-dropdown">
        <button
          className="danger"
          onClick={async () => {
            if (window.confirm('Видалити спринт?')) {
              await deleteSprint(sprint.id);
              setOpenMenuId(null);
            }
          }}
        >
          🗑 Видалити спринт
        </button>
      </div>
    )}
  </div>
</div>
                <p>📅 {sprint.startDate} → {sprint.endDate}</p>
                <p>🧩 Завдань: {sprintTasks.length}</p>
                <p>📊 Прогрес: {calculateProgress(sprint)}%</p>

                <button
                  onClick={() => {
                    setSelectedSprintId(sprint.id);
                    setShowTaskModal(true);
                  }}
                >
                  ➕ Створити задачу
                </button>

                <div className="sprint-tasks">
                  {sprintTasks.map(task => (
                    <Task
                      key={task.id}
                      task={task}
                      columnId={task.columnId}
                      sprintId={sprint.id}
                    />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ===== Modal ===== */}
      {showTaskModal && (
        <div className="modal">
          <div className="modal-content">
            <input
              placeholder="Назва задачі"
              value={newTaskTitle}
              onChange={e => setNewTaskTitle(e.target.value)}
            />
            <button onClick={handleCreateTask}>Створити</button>
            <button onClick={() => setShowTaskModal(false)}>
              Скасувати
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sprint;