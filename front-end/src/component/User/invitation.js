import { useEffect, useState } from 'react';
import { getNotifications, markNotificationRead } from '../api/api';

export default function NotificationsPanel({ token, onUpdateCount }) {
  const [notifications, setNotifications] = useState([]);

  const loadNotifications = async () => {
    if (!token) return;
    const data = await getNotifications(token);
    setNotifications(data);
  };

  useEffect(() => {
    loadNotifications();
  }, [token]);

  const handleRead = async (id) => {
    await markNotificationRead(token, id);

    // прибираємо зі списку
    setNotifications(prev => prev.filter(n => n.id !== id));

    // оновлюємо лічильник 🔔
    if (onUpdateCount) onUpdateCount();
  };

  if (!notifications.length) return null;

  return (
    <div className="notifications-panel">
      <div className="panel-title">Сповіщення</div>

      {notifications.map(n => (
        <div
          key={n.id}
          className="notification-item"
          onClick={() => handleRead(n.id)}
        >
          {n.message}
        </div>
      ))}
    </div>
  );
}
