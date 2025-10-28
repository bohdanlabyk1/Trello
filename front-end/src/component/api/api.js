const BASE_URL = 'http://localhost:3002';

const fetchData = async (endpoint, options = {}) => {
  try {
    const token = options.token || localStorage.getItem('token');
    if (!token && endpoint !== '/auth-user/login' && endpoint !== '/auth-user/register') {
      throw new Error('No token found. Please login.');
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
};


export const createSprint = (token, { name, startDate, endDate, projectId,}) =>
  fetchData('/sprints', {
    method: 'POST',
    token,
    body: JSON.stringify({ name, startDate, endDate, projectId  }),
  });

export const getSprintsByProject = (token, projectId) =>
  fetchData(`/sprints/project/${projectId}`, {
    method: 'GET',
    token,
  });


// Auth / Projects
export const registerUser = (username, email, password, repit_password) =>
  fetchData('/auth-user/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password, repit_password }),
  });

export const loginUser = (email, password) =>
  fetchData('/auth-user/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const createProject = (token, name, description) =>
  fetchData('/projects', {
    method: 'POST',
    token,
    body: JSON.stringify({ name, description }),
  });

export const getInvitations = async (token) => {
  const res = await fetch(`${BASE_URL}/invitations`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const respondInvitation = async (token, id, accept) => {
  const res = await fetch(`${BASE_URL}/invitations/${id}/respond`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify({ accept }),
  });
  return res.json();
};

export const getUserProjects = (token) =>
  fetchData('/projects', {
    method: 'GET',
    token,
  });

export const deleteProject = (token, projectId) =>
  fetchData(`/projects/${projectId}`, {
    method: 'DELETE',
    token,
  });


export const getPanel = () => fetchData('/panel');

export const createColumn = (token, title, projectId) =>
  fetchData(`/projects/${projectId}/columns`, {
    method: 'POST',
    token,
    body: JSON.stringify({ title }),
  });

export const updateColumn = (token, columnId, title) =>
  fetchData(`/columns/${columnId}`, {
    method: 'PATCH',
    token,
    body: JSON.stringify({ title }),
  });

export const deleteColumn = (token, projectId, columnId) =>
  fetchData(`/projects/${projectId}/columns/${columnId}`, {
    method: 'DELETE',
    token,
  });


export const getColumnsByProject = (token, projectId) =>
  fetchData(`/projects/${projectId}/columns`, {
    method: 'GET',
    token,
  });

// Tasks API
export const createTask = (token, title, description, columnId) =>
  fetchData(`/columns/${columnId}/tasks`, { 
    method: 'POST',
    token,
    body: JSON.stringify({ title, description }),
  });


export const updateTask = (token, taskId, title, description) =>
  fetchData(`/tasks/${taskId}`, {
    method: 'PATCH',
    token,
    body: JSON.stringify({ title, description }),
  });

export const moveTask = (token, taskId, targetColumnId, newOrder) =>
  fetchData(`/tasks/${taskId}/move`, {
    method: 'PATCH',
    token,
    body: JSON.stringify({ targetColumnId, newOrder }),
  });

export const deleteTask = (token, columnId, taskId) =>
  fetchData(`/columns/${columnId}/tasks/${taskId}`, {
    method: 'DELETE',
    token,
  });

export const inviteUserToProject = (token, email, projectId) =>
  fetchData('/invitations/invite', {
    method: 'POST',
    token,
    body: JSON.stringify({ email, projectId }),
  });

export const getTasksByColumn = (token, columnId) =>
  fetchData(`/tasks/column/${columnId}`, {
    method: 'GET',
    token,
  });

// Comments API
export const createComment = (token, text, taskId) =>
  fetchData('/comments', {
    method: 'POST',
    token,
    body: JSON.stringify({ text, taskId }),
  });

export const deleteComment = (token, commentId) =>
  fetchData(`/comments/${commentId}`, {
    method: 'DELETE',
    token,
  });

export const getCommentsByTask = (token, taskId) =>
  fetchData(`/comments/task/${taskId}`, {
    method: 'GET',
    token,
  });
export const addUserToProject = (token, projectId, email) =>
  fetchData(`/projects/${projectId}/users`, {
    method: 'POST',
    token,
    body: JSON.stringify({ email }),
  });

export const getProjectUsers = (token, projectId) =>
  fetchData(`/projects/${projectId}/users`, {
    method: 'GET',
    token,
  });
