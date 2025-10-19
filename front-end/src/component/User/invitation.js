import { useEffect, useState } from 'react';
import { getInvitations, respondInvitation } from '../api/api';

export default function InvitationsPanel({ token }) {
  const [invitations, setInvitations] = useState([]);

  useEffect(() => {
    getInvitations(token).then(setInvitations);
  }, []);

  const handleResponse = async (id, accept) => {
    await respondInvitation(token, id, accept);
    setInvitations(prev => prev.filter(inv => inv.id !== id));
  };

  return (
    <div className="invitations-panel">
      <h3>📩 Ваші запрошення</h3>
      {invitations.length === 0 ? (
        <p>Немає нових запрошень</p>
      ) : (
        invitations.map(inv => (
          <div key={inv.id} className="invite-card">
            <p>
              <b>{inv.sender.username}</b> запросив вас у проєкт <b>{inv.project.name}</b>
            </p>
            <button onClick={() => handleResponse(inv.id, true)}>✅ Прийняти</button>
            <button onClick={() => handleResponse(inv.id, false)}>❌ Відхилити</button>
          </div>
        ))
      )}
    </div>
  );
}
