import React, { useEffect, useState } from 'react';
import './../style/style.css';
import { useNavigate } from 'react-router-dom';
import { getUserProjects, createProject, deleteProject } from '../api/api';
import { useProjectStore } from '../boards/apiboardc';

const Project = ({ ismodal, setIsmodal }) => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const navigate = useNavigate();
  const { setProject, loadColumns } = useProjectStore.getState();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    getUserProjects(token).then((data) => {
      setProjects(data);
      if (data.length === 0) setIsmodal(true);
    });
  }, [setIsmodal]);

  const handleOpenProject = (project) => {
    setProject(project);       // ⚡ встановлюємо активний проект
    loadColumns(project.id);   // ⚡ завантажуємо колонки для цього проекту
    navigate(`/project/${project.id}`);
  };

  const handleCreateProject = async () => {
    const token = localStorage.getItem('token');
    if (!newProject.name) return alert('Введіть назву проекту');

    try {
      const newProj = await createProject(token, newProject.name, newProject.description);

      // ⚡ Додаємо новий проект у state та робимо його активним
      setProjects([...projects, newProj]);
      setProject(newProj);
      setIsmodal(false);

      await loadColumns(newProj.id); // завантажуємо колонки для нового проекту

      navigate(`/project/${newProj.id}`);
    } catch (err) {
      console.error('Помилка при створенні проекту:', err);
      alert('Не вдалося створити проект');
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await deleteProject(token, id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Помилка при видаленні проекту:', error);
    }
  };

  return (
    <div className="projects">
      <h2>Мої проекти</h2>
      <div className="projects-list">
        {projects.map((p) => (
          <div key={p.id} className="project-card">
            <h3 onClick={() => handleOpenProject(p)} style={{ cursor: 'pointer' }}>
              {p.name}
            </h3>
            <p>{p.description}</p>
            <button onClick={() => handleDeleteProject(p.id)}>Видалити</button>
          </div>
        ))}
      </div>

      {ismodal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Створи проект</h2>
            <input
              type="text"
              placeholder="Назва проекту"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            />
            <textarea
              placeholder="Опис"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            />
            <button onClick={handleCreateProject}>Створити</button>
            <button onClick={() => setIsmodal(false)}>Скасувати</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Project;
