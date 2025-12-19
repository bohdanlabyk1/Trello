import React, { useEffect, useState } from 'react';
import './../style/style.css';
import { useNavigate } from 'react-router-dom';
import { getUserProjects, createProject, deleteProject } from '../api/api';
import { useProjectStore } from '../boards/apiboardc';

const Project = ({ ismodal, setIsmodal }) => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const navigate = useNavigate();

  const { setProject, loadColumns } = useProjectStore();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    getUserProjects(token).then(data => {
      setProjects(data);
      if (data.length === 0) setIsmodal(true);
    });
  }, [setIsmodal]);

  const handleOpenProject = async (project) => {
    setProject(project);
    await loadColumns(project.id);
    navigate(`/project/${project.id}`);
  };

  const handleCreateProject = async () => {
    const token = localStorage.getItem('token');
    if (!newProject.name) {
      alert('Введіть назву проекту');
      return;
    }

    try {
      const newProj = await createProject(
        token,
        newProject.name,
        newProject.description
      );

      setProjects(prev => [...prev, newProj]);
      setProject(newProj);
      setIsmodal(false);

      await loadColumns(newProj.id);
      navigate(`/project/${newProj.id}`);
    } catch (e) {
      console.error(e);
      alert('Не вдалося створити проект');
    }
  };

  const handleDeleteProject = async (id) => {
    const token = localStorage.getItem('token');
    await deleteProject(token, id);
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="projects">
      <h2>Мої проекти</h2>

      <div className="projects-list">
        {projects.map(p => (
          <div key={p.id} className="project-card">
            <h3
              style={{ cursor: 'pointer' }}
              onClick={() => handleOpenProject(p)}
            >
              {p.name}
            </h3>
            <p>{p.description}</p>
            <button onClick={() => handleDeleteProject(p.id)}>
              Видалити
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
                setNewProject({ ...newProject, name: e.target.value })
              }
            />

            <textarea
              placeholder="Опис"
              value={newProject.description}
              onChange={e =>
                setNewProject({ ...newProject, description: e.target.value })
              }
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
