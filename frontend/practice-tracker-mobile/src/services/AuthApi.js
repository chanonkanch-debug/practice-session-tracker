// backend url : https://practice-session-tracker.onrender.com (Currently deployed of render.com)

const API_URL = 'https://practice-session-tracker.onrender.com/';
export { API_URL };

// auth token storage
let authToken = null;

// set auth (called after login)
export const setAuthToken = (token) => {
    authToken = token;
};

// get auth
export const getAuthToken = () => {
    return authToken;
};

// clear auth (called on logout)
export const clearAuthToken = () => {
    authToken = null;
};

// API functions
export const authApi = {

    // Register user
    register: async (email, username, password) => {
        try {
            const response = await fetch(`${API_URL}api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, username, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            return data;
        } catch (error) {
            throw error;
        }
    },

    // Login User
    login: async (email, password) => {
        try {
            const response = await fetch(`${API_URL}api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Store token
            if (data.token) {
                setAuthToken(data.token);
            }

            return data;
        } catch (error) {
            throw error;
        }
    },

    // Get current user
    getCurrentUser: async () => {

        try {
            const response = await fetch(`${API_URL}api/auth/me`, {
                
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get user');
            }

            return data;
        } catch (error) {
            throw error;
        }
    }
};

