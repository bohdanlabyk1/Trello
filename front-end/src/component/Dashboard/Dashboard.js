import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUserProjects } from './../api/api';
import UsersPanel from './../User/userpanel';
import Board from './../boards/board';
import Sprint from './sprint';
import { Outlet, useLocation } from "react-router-dom";
import './../style/style.css';
import UsersList from '../User/UserList';
import Analytics from '../analytics/Analytics';
import ActivityLog from './../activyti/Activyti';
import { useProjectStore } from './../boards/apiboardc';

const Dashboard = () => {
  const { id } = useParams();
   const user = useProjectStore((state) => state.user);
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState('board');
const location = useLocation();
  
const isManagerOrAdmin = user?.role === 'manager';

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem('token');
        const projects = await getUserProjects(token);
        const foundProject = projects.find(p => p.id === Number(id));
        setProject(foundProject || null);
      } catch (error) {
        console.error('Помилка при завантаженні проекту:', error);
      }
    };
    if (id) fetchProject();
  }, [id]);

  if (!project) return <div className="loading">Завантаження...</div>;

   return (
    <div className="dashboard">
      <div className="dashboard-sidebar">
        <h2>{project.name}</h2>
        <ul className="menu-list">
          {/* Доступно всім */}
          <li
            className={`menu-item ${activeTab === 'board' ? 'active' : ''}`}
            onClick={() => setActiveTab('board')}
          >
            📋 Дошка
          </li>
          
          <li
            className={`menu-item ${activeTab === 'sprint' ? 'active' : ''}`}
            onClick={() => setActiveTab('sprint')}
          >
            🚀 Спринт
          </li>

          <li
             className={`menu-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
          >
            👥 Команда
          </li>

      
          {isManagerOrAdmin && (
            <>
              <li
                className={`menu-item ${activeTab === 'analytics' ? 'active' : ''}`}
                onClick={() => setActiveTab('analytics')}
              >
                📊 Аналітика
              </li>
              <li
                className={`menu-item ${activeTab === 'activity' ? 'active' : ''}`}
                onClick={() => setActiveTab('activity')}
              >
                🕒 Активність
              </li>
            </>
          )}
        </ul>
      </div>

      <div className="dashboard-content">
        {location.pathname.includes("/sprint/") ? (
          <Outlet />
        ) : (
          <>
            {activeTab === 'board' && <Board projectId={project.id} />}
            {activeTab === 'sprint' && <Sprint projectId={project.id} />}
            
            {/* Додатковий захист на рівні контенту */}
            {activeTab === 'users' && (
              <UsersList
                token={localStorage.getItem('token')}
                projectId={project.id}
              />
            )}
            
            {isManagerOrAdmin && activeTab === 'analytics' && <Analytics />}
            {isManagerOrAdmin && activeTab === 'activity' && (
              <ActivityLog projectId={project.id} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
