import React, { useState, useEffect } from 'react';
import * as api from './../api/api';
import './dashboard.css';

const Sprint = ({ projectId }) => {
  const token = localStorage.getItem('token');
  const [sprints, setSprints] = useState([]);
  const [newSprint, setNewSprint] = useState({
    name: '',
    startDate: '',
    endDate: '',
  });

  // Завантажуємо спринти
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

  const handleCreateSprint = async () => {
    if (!newSprint.name || !newSprint.startDate || !newSprint.endDate) {
      alert('Будь ласка, заповніть усі поля!');
      return;
    }

    try {
      const created = await api.createSprint(token, {
        name: newSprint.name,
        startDate: newSprint.startDate,
        endDate: newSprint.endDate,
        projectId,

      });
      setSprints([...sprints, created]);
      setNewSprint({ name: '', startDate: '', endDate: '' });
    } catch (err) {
      console.error('Помилка при створенні спринта:', err);
    }
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
            <div key={sprint.id} className="sprint-card">
              <h3>{sprint.name}</h3>
              <p>📅 {sprint.startDate} — {sprint.endDate}</p>
              <p>🧩 Завдань: {sprint.tasks?.length || 0}</p>
              {sprint.assignedToUser && (
                <p>👤 Призначено: {sprint.assignedToUser.username}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sprint;
