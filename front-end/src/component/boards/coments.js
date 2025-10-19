import React, { useState } from 'react';
import * as api from './../api/api';
import { useProjectStore } from './apiboardc';

const CommentList = ({ taskId, comments, token }) => {
  const [text, setText] = useState('');
  const { loadComments } = useProjectStore();

  const addComment = async () => {
    if (!text) return;
    await api.createComment(token, text, taskId);
    setText('');
    loadComments(token, taskId);
  };

  return (
    <div style={{ marginTop: '8px' }}>
      {comments.map(c => (
        <div key={c.id} style={{ borderTop: '1px solid #eee', padding: '4px 0' }}>
          {c.text}
        </div>
      ))}
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add comment"
        style={{ width: '100%', marginTop: '4px' }}
      />
      <button onClick={addComment}>Add</button>
    </div>
  );
};

export default CommentList;
