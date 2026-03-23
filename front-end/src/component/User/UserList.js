import { useState, useEffect, useMemo } from "react";
import { getProjectUsers } from "./../api/api";
import UsersModal from "./User";
import "./../style/user.css";
import { useProjectStore } from './../boards/apiboardc';

export default function UsersList({ token, projectId }) {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);

  const { searchQuery, searchType } = useProjectStore();

  const loadUsers = async () => {
    try {
      const data = await getProjectUsers(token, projectId);
      setUsers(data);
    } catch (err) {
      console.error("Load users error:", err);
    }
  };

  useEffect(() => {
    if (token && projectId) {
      loadUsers();
    }
  }, [token, projectId]);

  // ===== 🔍 FILTER USERS =====
  const filteredUsers = useMemo(() => {
    if (searchType !== 'user' || !searchQuery.trim()) {
      return users;
    }

    return users.filter(u => {
      const fullName = `${u.first_name || ''} ${u.last_name || ''}`.toLowerCase();
      const email = u.email.toLowerCase();
      const query = searchQuery.toLowerCase();

      return (
        fullName.includes(query) ||
        email.includes(query)
      );
    });
  }, [users, searchQuery, searchType]);

  return (
    <div className="users-wrapper">

      {/* Header */}
      <div className="users-header">
        <h3 className="users-title">
          👥 Користувачі
        </h3>

        <button
          onClick={() => setOpen(true)}
          className="invite-open-btn"
        >
          + Запросити
        </button>
      </div>

      {/* Users list */}
      <div className="users-list">
        {filteredUsers.map((u) => (
          <div key={u.id} className="user-card">

            <div className="user-avatar">
              {u.email[0].toUpperCase()}
            </div>

            <div className="user-info">
              <span className="user-name">
                {`${u.first_name || ""} ${u.last_name || ""}`.trim() || "User"}
              </span>

              <span className="user-email">
                {u.email}
              </span>
            </div>
          </div>
        ))}

        {filteredUsers.length === 0 && (
          <p className="empty-text">
            Нічого не знайдено 😢
          </p>
        )}
      </div>

      {/* Modal */}
      {open && (
        <UsersModal
          token={token}
          projectId={projectId}
          onClose={() => setOpen(false)}
          onSuccess={loadUsers}
        />
      )}
    </div>
  );
}