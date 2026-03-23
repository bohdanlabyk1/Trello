import React, { useEffect } from "react";
import { useProjectStore } from "../boards/apiboardc";
import "./../style/activity.css";

const icons = {
  CREATE_TASK: "🆕",
  CHANGE_STATUS: "🔁",
  MOVE_TASK: "📦",
  MOVE_COLUMN: "📊",
  ADD_MEMBER: "👤",
  DELETE_TASK: "❌",
};

const renderText = (log) => {
  switch (log.action) {
    case "CREATE_TASK":
      return `створив задачу "${log.meta?.title}"`;
    case "CHANGE_STATUS":
      return `змінив статус з "${log.meta.from}" на "${log.meta.to}"`;
    case "MOVE_TASK":
      return `перемістив задачу`;
    case "ADD_MEMBER":
      return `додав учасника`;
    case "DELETE_TASK":
      return `видалив задачу "${log.meta?.title}"`;

    default:
      return "виконав дію";
  }
};

const ActivityLog = ({ projectId }) => {
  const { activityLogs, loadActivityLogs, clearActivityLogs } =
    useProjectStore();

  useEffect(() => {
    loadActivityLogs(projectId);
  }, [projectId]);

  const handleClear = async () => {
    if (!window.confirm("Очистити всю історію активності?")) return;
    await clearActivityLogs(projectId);
  };

  return (
    <div className="activity-log">
      <div className="activity-header">
        <h3>🕒 Activity Log</h3>

        {activityLogs.length > 0 && (
          <button className="clear-log-btn" onClick={handleClear}>
            🧹 Очистити
          </button>
        )}
      </div>

      {activityLogs.length === 0 ? (
        <p className="empty-log">Історія порожня</p>
      ) : (
        activityLogs.map((log) => (
          <div key={log.id} className="log-item">
            <span className="icon">{icons[log.action]}</span>

            <div className="content">
              <div>
                <b>{log.user?.first_name || "User"}</b> {renderText(log)}
              </div>
              <small>{new Date(log.createdAt).toLocaleString()}</small>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ActivityLog;
