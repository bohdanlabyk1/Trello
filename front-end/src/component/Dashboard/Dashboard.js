import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUserProjects, getPanel } from '../api/api';
import Board from './../boards/board';
import './dashboard.css';

const Dashboard = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [panel, setPanel] = useState(null);
  const [openMenus, setOpenMenus] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [projects, panels] = await Promise.all([getUserProjects(token), getPanel()]);
        const foundProject = projects.find(p => p.id === Number(id));
        setProject(foundProject);

        const formattedPanel = panels.map(panel => ({
          id: panel.id,
          title: panel.title,
          submenu: panel.items?.map(item => ({
            id: item.id,
            title: item.name,
            content: item.content || `Контент для ${item.name}`
          })) || [],
        }));
        setPanel(formattedPanel);
      } catch (error) {
        console.error('Помилка при завантаженні даних:', error);
      }
    };
    fetchData();
  }, [id]);

  if (!project || !panel) return <div className="loading">Завантаження...</div>;

  const toggleMenu = (id) => setOpenMenus(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="dashboard">
      <div className="dashboard-sidebar">
        <h2>{project.name}</h2>
        <ul className="menu-list">
          {panel.map(item => (
            <li key={item.id} className="menu-item">
              <div className="menu-title" onClick={() => toggleMenu(item.id)}>
                <strong>{item.title}</strong>
                {item.submenu.length > 0 && (
                  <span className="menu-arrow">{openMenus[item.id] ? "▲" : "▼"}</span>
                )}
              </div>
              {item.submenu.length > 0 && openMenus[item.id] && (
                <ul className="submenu-list">
                  {item.submenu.map(sub => (
                    <li key={sub.id} className="submenu-item" >
                      {sub.title}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="dashboard-content">
       <Board/>
      </div>
    </div>
  );
};

export default Dashboard;
