import { useEffect, useState } from "react";
import {
  getInvitations,
  getSentInvitations,
  getNotifications, 
  respondInvitation,
   markNotificationRead, 
} from "../api/api";
import "./../style/aliert.css";

export default function AllNotificationsPanel({ token, onUpdateCount }) {
  const [items, setItems] = useState([]);

  // 🔄 Завантаження ВСІХ сповіщень
  const load = async () => {
    try {
      const received = await getInvitations(token);
      const sent = await getSentInvitations(token);
      const notifications = await getNotifications(token); // 🔥 response

      // 📩 Отримані інвайти
      const formattedReceived = received.map((i) => ({
        ...i,
        type: "received",
      }));

      // 📤 Надіслані
      const formattedSent = sent.map((i) => ({
        ...i,
        type: "sent",
      }));

      // 🔔 Response notifications
      const formattedNotifications = notifications.map((n) => ({
        ...n,
        type: "notification",
      }));

      const allItems = [
        ...formattedReceived,
        ...formattedSent,
        ...formattedNotifications,
      ];

      setItems(allItems);

      // 🔢 Лічильник
      onUpdateCount?.(allItems.length);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (token) load();
  }, [token]);

  // ✅ Відповідь на інвайт
  const handleRespond = async (id, accept) => {
    try {
      await respondInvitation(token, id, accept);

      // після відповіді перезавантажуємо
      await load();
    } catch (e) {
      console.error(e);
    }
  };

  // 🗑 Видалення notification (локально)
 const removeItem = async (id, type) => {
  try {
    // тільки для response notifications
    if (type === "notification") {
      await markNotificationRead(token, id);
    }

    setItems((prev) => {
      const updated = prev.filter(
        (i) => !(i.id === id && i.type === type)
      );

      onUpdateCount?.(updated.length);
      return updated;
    });
  } catch (e) {
    console.error(e);
  }
};


  // 📭 Якщо пусто
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
          {/* 📩 Отримані */}
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

          {/* 📤 Надіслані */}
          {i.type === "sent" && (
            <>
              <div>
                {i.project.name} →{" "}
                <strong>{i.recipient.username}</strong>
              </div>

              <div className={`status ${i.status}`}>
                {i.status === "pending" && "⏳ Очікує"}
                {i.status === "accepted" && "✔ Прийняв"}
                {i.status === "rejected" && "✖ Відхилив"}
              </div>
            </>
          )}

          {/* 🔔 Response notifications */}
          {i.type === "notification" && (
            <div className="notification-text">
              🔔 {i.message}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
