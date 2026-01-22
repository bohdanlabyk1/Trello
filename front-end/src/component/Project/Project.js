import React, { useState, useEffect } from 'react';
import './../style/project.css';
import { useNavigate } from 'react-router-dom';
import {
  getUserProjects,
  createProject,
  deleteProject,
} from '../api/api';
import { useProjectStore } from '../boards/apiboardc';

const Project = ({ ismodal, setIsmodal }) => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
  });

  const navigate = useNavigate();
  const { loadProjectData } = useProjectStore();

  // ===== LOAD PROJECTS =====
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const loadProjects = async () => {
      const data = await getUserProjects(token);
      setProjects(data);
      if (data.length === 0) setIsmodal(true);
    };

    loadProjects();
  }, [setIsmodal]);

  // ===== OPEN PROJECT =====
  const handleOpenProject = async project => {
    await loadProjectData(project.id);
    navigate(`/project/${project.id}`);
  };

  // ===== CREATE PROJECT =====
  const handleCreateProject = async () => {
    const token = localStorage.getItem('token');

    if (!newProject.name.trim()) {
      alert('Введіть назву проекту');
      return;
    }

    try {
      const createdProject = await createProject(
        token,
        newProject.name,
        newProject.description
      );

      setProjects(prev => [...prev, createdProject]);
      setIsmodal(false);

      await loadProjectData(createdProject.id);
      navigate(`/project/${createdProject.id}`);
    } catch (error) {
      console.error(error);
      alert('Не вдалося створити проект');
    }
  };

  // ===== DELETE PROJECT =====
  const handleDeleteProject = async projectId => {
    const token = localStorage.getItem('token');
    await deleteProject(token, projectId);

    setProjects(prev => prev.filter(p => p.id !== projectId));
  };

  return (
    <div className="projects">
      <h2>Панель керування проєктами</h2>

      <div className="projects-list">
        <button
      className="create-project-btn"
      onClick={() => setIsmodal(true)}
    >
       Створити проект
    </button>
        {projects.map(project => (
          <div key={project.id} className="project-card">
            <h3
              style={{ cursor: 'pointer' }}
              onClick={() => handleOpenProject(project)}
            >
              {project.name}
            </h3>

            <p>{project.description}</p>

            <button onClick={() => handleDeleteProject(project.id)}>
             Видалити проєкт
            </button>
          </div>
        ))}
      </div>

      {ismodal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Створи проект</h2>

            <input
              placeholder="Назва проекту"
              value={newProject.name}
              onChange={e =>
                setNewProject({
                  ...newProject,
                  name: e.target.value,
                })
              }
            />

            <textarea
              placeholder="Опис"
              value={newProject.description}
              onChange={e =>
                setNewProject({
                  ...newProject,
                  description: e.target.value,
                })
              }
            />

            <button onClick={handleCreateProject}>
              Створити
            </button>
            <button onClick={() => setIsmodal(false)}>
              Скасувати
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Project;
