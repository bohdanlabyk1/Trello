import { useEffect, useState } from 'react';
import { addUserToProject, getProjectUsers } from '../api';

export default function UsersModal({ token, projectId, onClose }) {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const data = await getProjectUsers(token, projectId);
    setUsers(data);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!email) return;
    await addUserToProject(token, projectId, email);
    setEmail('');
    loadUsers();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
        {/* Кнопка закриття */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4">👥 Користувачі проекту</h2>

        {/* Форма */}
        <form onSubmit={handleAddUser} className="flex gap-2 mb-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email користувача"
            className="border rounded-lg p-2 flex-1"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Запросити
          </button>
        </form>

        {/* Список */}
        <ul className="space-y-2 max-h-60 overflow-y-auto">
          {users.map((user) => (
            <li
              key={user.id}
              className="p-2 border rounded-lg bg-gray-50 flex items-center justify-between"
            >
              <span>{user.email}</span>
              <span className="text-xs text-gray-500">
                {user.role || 'учасник'}
              </span>
            </li>
          ))}
          {users.length === 0 && (
            <p className="text-gray-500 text-sm">Поки що немає користувачів 🙃</p>
          )}
        </ul>
      </div>
    </div>
  );
}
