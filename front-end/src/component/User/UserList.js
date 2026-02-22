import { useState, useEffect } from "react";
import { getProjectUsers } from "./../api/api";
import UsersModal from "./User";
import "./../style/user.css";

export default function UsersList({ token, projectId }) {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);

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
        {users.map((u) => (
          <div key={u.id} className="user-card">
            
            <div className="user-avatar">
              {u.email[0].toUpperCase()}
            </div>

            <div className="user-info">
              <span className="user-name">
                {u.name || "User"}
              </span>

              <span className="user-email">
                {u.email}
              </span>
            </div>
          </div>
        ))}

        {users.length === 0 && (
          <p className="empty-text">
            Поки що немає користувачів 🙃
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
