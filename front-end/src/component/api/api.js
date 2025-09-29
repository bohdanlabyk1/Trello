const BASE_URL = 'http://localhost:3002';

const fetchData = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      },
      ...options,
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
  fetchData('/projects/create', {
    method: 'POST',
    token,
    body: JSON.stringify({ name, description }),
  });

export const getUserProjects = (token) =>
  fetchData('/projects/my', {
    method: 'GET',
    token,
  });

export const deleteProject = (token, projectId) =>
  fetchData(`/projects/${projectId}`, {
    method: 'DELETE',
    token,
  });

// Panel
export const getPanel = () => fetchData('/panel');

// Columns API
export const createColumn = (token, title, projectId) =>
  fetchData('/columns', {
    method: 'POST',
    token,
    body: JSON.stringify({ title, projectId }),
  });

export const updateColumn = (token, columnId, title) =>
  fetchData(`/columns/${columnId}`, {
    method: 'PATCH',
    token,
    body: JSON.stringify({ title }),
  });

export const deleteColumn = (token, columnId) =>
  fetchData(`/columns/${columnId}`, {
    method: 'DELETE',
    token,
  });

export const getColumnsByProject = (token, projectId) =>
  fetchData(`/columns/project/${projectId}`, {
    method: 'GET',
    token,
  });

// Tasks API
export const createTask = (token, title, description, columnId) =>
  fetchData('/tasks', {
    method: 'POST',
    token,
    body: JSON.stringify({ title, description, columnId }),
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

export const deleteTask = (token, taskId) =>
  fetchData(`/tasks/${taskId}`, {
    method: 'DELETE',
    token,
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
