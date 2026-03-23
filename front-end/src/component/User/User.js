import { useEffect, useState } from "react";
import { inviteUserToProject } from "./../api/api";
import "./../style/user.css";

export default function UsersModal({
  token,
  projectId,
  onClose,
  onSuccess,
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ===== Invite =====
  const handleInvite = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Введіть email користувача");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await inviteUserToProject(
        token,
        email,
        projectId
      );

      setEmail("");
      onSuccess?.();
      onClose();

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ===== ESC close =====
  useEffect(() => {
    const esc = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", esc);
    return () =>
      window.removeEventListener("keydown", esc);
  }, [onClose]);

return (
  <div className="modal-overlay2" onClick={onClose}>
    <div
      className="modal-content2"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="modal-header">
        <h2>📩 Запросити користувача</h2>

        <button
          onClick={onClose}
          className="close-btn"
        >
          ✕
        </button>
      </div>

      {/* Subtitle */}
      <p className="subtitle">
        Введіть email користувача, щоб
        додати його до проєкту
      </p>

      {/* Form */}
      <form
        onSubmit={handleInvite}
        className="invite-form"
      >
        <input
          type="email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          placeholder="example@email.com"
          className="email-input"
        />

        <button
          disabled={loading}
          className="invite-btn"
        >
          {loading ? "..." : "Запросити"}
        </button>
      </form>

      {error && (
        <p className="error-text">
          {error}
        </p>
      )}
    </div>
  </div>
);

}
