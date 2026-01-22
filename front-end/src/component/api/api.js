const BASE_URL = "http://localhost:3002";

const fetchData = async (endpoint, options = {}) => {
  const token = options.token || localStorage.getItem("token");

  if (
    !token &&
    !["/auth-user/login", "/auth-user/register"].includes(endpoint)
  ) {
    throw new Error("No token found. Please login.");
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": options.body ? "application/json" : undefined,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP error! Status: ${response.status}`
    );
  }

  return response.json();
};
// ===== AUTH =====
export const loginUser = (email, password) =>
  fetchData("/auth-user/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const registerUser = (username, email, password, repit_password) =>
  fetchData("/auth-user/register", {
    method: "POST",
    body: JSON.stringify({ username, email, password, repit_password }),
  });

// ===== PROJECTS =====
export const getUserProjects = (token) =>
  fetchData("/projects", { method: "GET", token });

export const createProject = (token, name, description) =>
  fetchData("/projects", {
    method: "POST",
    token,
    body: JSON.stringify({ name, description }),
  });

export const getActivityLogs = (token, projectId) =>
  fetchData(`/activity/${projectId}`, {
    method: "GET",
    token,
  });
export const clearActivityLogs = (token, projectId) =>
  fetchData(`/activity/project/${projectId}`, {
    method: "DELETE",
    token,
  });

export const deleteProject = (token, projectId) =>
  fetchData(`/projects/${projectId}`, { method: "DELETE", token });

// ===== COLUMNS =====
export const getColumnsByProject = (token, projectId) =>
  fetchData(`/projects/${projectId}/columns`, { method: "GET", token });

export const createColumn = (token, title, projectId) =>
  fetchData(`/projects/${projectId}/columns`, {
    method: "POST",
    token,
    body: JSON.stringify({ title }),
  });

export const deleteColumn = (token, projectId, columnId) =>
  fetchData(`/projects/${projectId}/columns/${columnId}`, {
    method: "DELETE",
    token,
  });

export const updateColumnColor = (token, columnId, color) =>
  fetchData(`/projects/columns/${columnId}/color`, {
    method: "PATCH",
    token,
    body: JSON.stringify({ color }),
  });

// ===== TASKS =====
export const getTasksByColumn = (token, columnId) =>
  fetchData(`/columns/${columnId}/tasks`, { method: "GET", token });

export const createTask = (
  token,
  {
    title,
    columnId,
    description = "",
    priority = "low",
    status = "todo",
    sprintId = null,
  }
) =>
  fetchData(`/columns/${columnId}/tasks`, {
    method: "POST",
    token,
    body: JSON.stringify({ title, description, priority, status, sprintId }),
  });

export const updateTask = (token, columnId, taskId, data) =>
  fetchData(`/columns/${columnId}/tasks/${taskId}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(data),
  });

export const moveTask = (token, columnId, taskId, targetColumnId, newOrder) =>
  fetchData(`/columns/${columnId}/tasks/${taskId}/move`, {
    method: "PATCH",
    token,
    body: JSON.stringify({ targetColumnId, newOrder }),
  });

export const deleteTask = (token, columnId, taskId) =>
  fetchData(`/columns/${columnId}/tasks/${taskId}`, {
    method: "DELETE",
    token,
  });

// ===== SPRINTS =====
export const getSprintsByProject = (token, projectId) =>
  fetchData(`/sprints/project/${projectId}`, { method: "GET", token });

export const createSprint = (token, { name, startDate, endDate, projectId }) =>
  fetchData("/sprints", {
    method: "POST",
    token,
    body: JSON.stringify({ name, startDate, endDate, projectId }),
  });

export const activateSprint = (token, sprintId, projectId) =>
  fetchData(`/sprints/${sprintId}/activate`, {
    method: "POST",
    token,
    body: JSON.stringify({ projectId }),
  });

export const closeSprint = (token, sprintId) =>
  fetchData(`/sprints/${sprintId}/close`, {
    method: "POST",
    token,
  });

export const deleteSprint = (token, sprintId) =>
  fetchData(`/sprints/${sprintId}`, {
    method: "DELETE",
    token,
  });

export const createComment = (token, text, taskId) =>
  fetchData("/comments", {
    method: "POST",
    token,
    body: JSON.stringify({ text, taskId }),
  });

export const deleteComment = (token, commentId) =>
  fetchData(`/comments/${commentId}`, { method: "DELETE", token });

export const getCommentsByTask = (token, taskId) =>
  fetchData(`/comments/task/${taskId}`, { method: "GET", token });

export const getProjectUsers = (token, projectId) =>
  fetchData(`/projects/${projectId}/users`, { method: "GET", token });

export const inviteUserToProject = (token, email, projectId) =>
  fetchData("/invitations/invite", {
    method: "POST",
    token,
    body: JSON.stringify({ email, projectId }),
  });

export const assignTaskToSprint = (token, columnId, taskId, sprintId) =>
  fetchData(`/columns/${columnId}/tasks/${taskId}/assign-sprint`, {
    method: "POST",
    token,
    body: JSON.stringify({ sprintId }),
  });
export const getInvitations = (token) =>
  fetchData("/invitations", { method: "GET", token });

export const respondInvitation = (token, id, accept) =>
  fetchData(`/invitations/${id}/respond`, {
    method: "POST",
    token,
    body: JSON.stringify({ accept }),
  });

export const getInvitationsCount = (token) =>
  fetchData("/invitations/count", { method: "GET", token });

export const getNotifications = (token) =>
  fetchData("/notifications", { method: "GET", token });

export const getNotificationsCount = (token) =>
  fetchData("/notifications/count", { method: "GET", token });

export const markNotificationRead = (token, id) =>
  fetchData(`/notifications/${id}/read`, {
    method: "PATCH",
    token,
  });
