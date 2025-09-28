import React, { useEffect, useState } from 'react';
import './project.css';
import { useNavigate } from 'react-router-dom';
import { getUserProjects, createProject, deleteProject } from '../api/api';

const Project = ({ ismodal, setIsmodal }) => {
  const [project, setProject] = useState([]);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    getUserProjects(token).then((data) => {
      setProject(data);
      if (data.length === 0) {
        setIsmodal(true);
      }
    });
  }, [setIsmodal]);

  const handleOpenProject = (id) => {
    navigate(`/project/${id}`);
  };

  const handleCreateProject = async () => {
    const token = localStorage.getItem('token');
    const newProj = await createProject(token, newProject.name, newProject.description);
    setProject([...project, newProj]);
    setIsmodal(false);
  };

  const handleDeleteProject = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await deleteProject(token, id);
      setProject((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Помилка при видаленні проекту:', error);
    }
  };

  return (
    <div className="projects">
      <h2>Мої проекти</h2>

      <div className="projects-list">
        {project.map((p) => (
          <div key={p.id} className="project-card">
            <h3 onClick={() => handleOpenProject(p.id)} style={{ cursor: 'pointer' }}>
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
              onChange={(e) =>
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
