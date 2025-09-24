const BASE_URL = 'http://localhost:3002';

const fetchData = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json();
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
    headers: { 'Content-Type': 'application/json' },  // додано
    body: JSON.stringify({ username, email, password, repit_password }),
  });

export const loginUser = (email, password) =>
  fetchData('/auth-user/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },  // додано
    body: JSON.stringify({ email, password }),
  });
