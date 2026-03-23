import { useEffect, useState, useRef } from "react";
import {
  getInvitations,
  getSentInvitations,
  getNotifications,
  respondInvitation,
  markNotificationRead,
} from "../api/api";
import "./../style/aliert.css";

export default function Aliert({ token, onUpdateCount }) {
  const [items, setItems] = useState([]);
  const isLoadingRef = useRef(false);

  // ===== LOAD NOTIFICATIONS =====
  const load = async () => {
    if (!token || isLoadingRef.current) return 0;

    isLoadingRef.current = true;
    try {
      const [received, sent, notifications] = await Promise.all([
        getInvitations(token),
        getSentInvitations(token),
        getNotifications(token),
      ]);

      const formattedReceived = received.map((i) => ({ ...i, type: "received" }));
      const formattedSent = sent.map((i) => ({ ...i, type: "sent" }));
      const formattedNotifications = notifications.map((n) => ({ ...n, type: "notification" }));

      const allItems = [...formattedReceived, ...formattedSent, ...formattedNotifications];

      setItems(allItems);
      onUpdateCount?.(allItems.length); // 🔔 оновлення цифри
      return allItems.length;
    } catch (e) {
      console.error(e);
      return 0;
    } finally {
      isLoadingRef.current = false;
    }
  };

  // ===== EFFECT =====
  useEffect(() => {
    if (!token) return;

    load(); // одразу

    const interval = setInterval(() => {
      load(); // кожні 5 сек
    }, 5000);

    return () => clearInterval(interval);
  }, [token]);

  // ===== RESPOND =====
  const handleRespond = async (id, accept) => {
    try {
      await respondInvitation(token, id, accept);
      await load();
    } catch (e) {
      console.error(e);
    }
  };

  // ===== REMOVE ITEM =====
  const removeItem = async (id, type) => {
    try {
      if (type === "notification") await markNotificationRead(token, id);

      setItems((prev) => {
        const updated = prev.filter((i) => !(i.id === id && i.type === type));
        onUpdateCount?.(updated.length);
        return updated;
      });
    } catch (e) {
      console.error(e);
    }
  };

  if (!items.length) {
    return (
      <div className="notifications-panel">
        <div className="panel-title">Сповіщення</div>
        <div className="empty-text">Сповіщень немає 📭</div>
      </div>
    );
  }

  return (
    <div className="notifications-panel">
      <div className="panel-title">Сповіщення</div>

      {items.map((i) => (
        <div
          key={`${i.type}-${i.id}`}
          className="notification-item clickable"
          onClick={() => removeItem(i.id, i.type)}
        >
          {/* RECEIVED */}
          {i.type === "received" && (
            <>
              <div>
                <strong>{i.sender.username}</strong> → {i.project.name}
              </div>
              <div className="actions">
                <button
                  className="accept"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRespond(i.id, true);
                  }}
                >
                  ✔
                </button>
                <button
                  className="reject"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRespond(i.id, false);
                  }}
                >
                  ✖
                </button>
              </div>
            </>
          )}

          {/* SENT */}
          {i.type === "sent" && (
            <>
              <div>
                {i.project.name} → <strong>{i.recipient.username}</strong>
              </div>
              <div className={`status ${i.status}`}>
                {i.status === "pending" && "⏳ Очікує"}
                {i.status === "accepted" && "✔ Прийняв"}
                {i.status === "rejected" && "✖ Відхилив"}
              </div>
            </>
          )}

          {/* NOTIFICATION */}
          {i.type === "notification" && <div className="notification-text">🔔 {i.message}</div>}
        </div>
      ))}
    </div>
  );
}