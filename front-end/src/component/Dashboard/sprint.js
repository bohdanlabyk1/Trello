import React, { useState, useEffect } from 'react';
import * as api from './../api/api';
import './../style/style.css';

const Sprint = ({ projectId }) => {
  const token = localStorage.getItem('token');
  const [sprints, setSprints] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [newSprint, setNewSprint] = useState({
    name: '',
    startDate: '',
    endDate: '',
  });
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [selectedTaskColumnId, setSelectedTaskColumnId] = useState(null);

  // Завантаження спринтів
  useEffect(() => {
    if (!projectId) return;
    const fetchSprints = async () => {
      try {
        const data = await api.getSprintsByProject(token, projectId);
        setSprints(data);
      } catch (err) {
        console.error('Помилка при завантаженні спринтів:', err);
      }
    };
    fetchSprints();
  }, [projectId, token]);

  // Завантаження задач проекту
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const columns = await api.getColumnsByProject(token, projectId);
        let allTasks = [];
        for (const col of columns) {
          const colTasks = await api.getTasksByColumn(token, col.id);
          allTasks = [...allTasks, ...colTasks.map(t => ({ ...t, columnId: col.id }))];
        }
        setTasks(allTasks);
      } catch (err) {
        console.error('Помилка при завантаженні задач:', err);
      }
    };
    if (projectId) fetchTasks();
  }, [projectId, token]);

  // Створення спринта
  const handleCreateSprint = async () => {
    if (!newSprint.name || !newSprint.startDate || !newSprint.endDate) {
      alert('Будь ласка, заповніть усі поля!');
      return;
    }
    try {
      const created = await api.createSprint(token, { ...newSprint, projectId });
      setSprints([...sprints, created]);
      setNewSprint({ name: '', startDate: '', endDate: '' });
    } catch (err) {
      console.error('Помилка при створенні спринта:', err);
    }
  };

  // Активація спринта
  const handleSetActive = async (sprintId) => {
    try {
      const updated = await api.activateSprint(token, sprintId, projectId);
      const newSprints = sprints.map(s =>
        s.id === updated.id ? updated : { ...s, isActive: false }
      );
      setSprints(newSprints);
    } catch (err) {
      console.error('Помилка при активації спринта:', err);
    }
  };

  // Призначення задачі на спринт
  const handleAssignTask = async (sprintId) => {
    if (!selectedTaskId || !selectedTaskColumnId) return;
    try {
      await api.assignTaskToSprint(token, selectedTaskColumnId, selectedTaskId, sprintId);
      alert('Задача призначена на спринт!');
      const updatedSprints = await api.getSprintsByProject(token, projectId);
      setSprints(updatedSprints);
      setSelectedTaskId(null);
      setSelectedTaskColumnId(null);
    } catch (err) {
      console.error('Помилка при призначенні задачі:', err);
    }
  };

  // Обчислення прогресу спринта
  const calculateProgress = (sprint) => {
    const total = sprint.tasks?.length || 0;
    const done = sprint.tasks?.filter(t => t.status === 'done').length || 0;
    return total ? Math.round((done / total) * 100) : 0;
  };

  return (
    <div className="sprint-container">
      <h2>Спринти проєкту #{projectId}</h2>

      <div className="sprint-form">
        <input
          type="text"
          placeholder="Назва спринта"
          value={newSprint.name}
          onChange={e => setNewSprint({ ...newSprint, name: e.target.value })}
        />
        <input
          type="date"
          value={newSprint.startDate}
          onChange={e => setNewSprint({ ...newSprint, startDate: e.target.value })}
        />
        <input
          type="date"
          value={newSprint.endDate}
          onChange={e => setNewSprint({ ...newSprint, endDate: e.target.value })}
        />
        <button onClick={handleCreateSprint}>➕ Створити спринт</button>
      </div>

      <div className="sprint-list">
        {sprints.length === 0 ? (
          <p>Немає створених спринтів</p>
        ) : (
          sprints.map(sprint => (
            <div key={sprint.id} className={`sprint-card ${sprint.isActive ? 'active' : ''}`}>
              <h3>{sprint.name}</h3>
              <p>📅 {sprint.startDate} — {sprint.endDate}</p>
              <p>🧩 Завдань: {sprint.tasks?.length || 0}</p>
              <p>📊 Прогрес: {calculateProgress(sprint)}%</p>

              {!sprint.isActive && !sprint.isClosed && (
                <button onClick={() => handleSetActive(sprint.id)}>Встановити активним</button>
              )}

              <div className="assign-task">
                <select
                  value={selectedTaskId || ''}
                  onChange={e => {
                    const task = tasks.find(t => t.id === Number(e.target.value));
                    setSelectedTaskId(task?.id || null);
                    setSelectedTaskColumnId(task?.columnId || null);
                  }}
                >
                  <option value="">Обрати задачу</option>
                  {tasks.map(task => (
                    <option key={task.id} value={task.id}>
                      {task.title}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleAssignTask(sprint.id)}
                  disabled={!selectedTaskId}
                >
                  Призначити на спринт
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sprint;
