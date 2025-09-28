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
    token, // fetchData підставить його у заголовок Authorization
  });
export const getPanel = () => fetchData('/panel');
