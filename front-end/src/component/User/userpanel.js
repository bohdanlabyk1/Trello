import { useEffect, useState } from 'react';
import { getProjectUsers, inviteUserToProject } from '../api/api';
import './../style/style.css';

export default function UsersPanel({ token, projectId, onClose }) {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const data = await getProjectUsers(token, projectId);
    setUsers(data);
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      setLoading(true);
      setMessage('');
      await inviteUserToProject(token, email, projectId);
      setMessage('Запрошення успішно надіслано!');
      setEmail('');
    } catch (err) {
      setMessage('Помилка при надсиланні запрошення');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>✖</button>
        <h2 className="title">👥 Користувачі проєкту</h2>

        <form onSubmit={handleInvite} className="invite-form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email користувача"
            className="email-input"
          />
          <button type="submit" className="invite-btn" disabled={loading}>
            {loading ? 'Надсилання...' : 'Запросити'}
          </button>
        </form>

        {message && <div className="info-text">{message}</div>}

        <div className="users-list">
          {users.length === 0 ? (
            <p className="empty-text">У цьому проєкті ще немає користувачів</p>
          ) : (
            users.map((user) => (
              <div key={user.id} className="user-card">
                <span className="user-avatar">{user.username[0].toUpperCase()}</span>
                <div className="user-info">
                  <div className="user-name">{user.username}</div>
                  <div className="user-email">{user.email}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
