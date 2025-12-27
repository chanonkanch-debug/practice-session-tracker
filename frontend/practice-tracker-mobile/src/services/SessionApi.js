import { API_URL, getAuthToken } from "./AuthApi";

export const SessionApi = {

    // Get all sessions
    getSessions: async () => {
        try {
            console.log('Fetching sessions from:', `${API_URL}api/sessions`)

            const response = await fetch(`${API_URL}api/sessions`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get sessions');
            }

            return data;
        } catch (error) {
            console.log('Get sessions error:', error);
            throw error;
        }
    },

    // Get a session
    getSession: async (sessionId) => {
        try {
            console.log('Fetching session:', sessionId);

            const response = await fetch(`${API_URL}api/sessions/${sessionId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get session');
            }

            return data;
        } catch (error) {
            console.log('Get session error:', error);
            throw error;
        }
    },

    // Get session with items (detailed view)
    getSessionWithItems: async (sessionId) => {
        try {
            console.log('Fetching session with items:', sessionId);

            const response = await fetch(`${API_URL}api/sessions/${sessionId}/items`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get session items');
            }

            return data;
        } catch (error) {
            console.log('Get session items error:', error);
            throw error;
        }
    },

    // Post, Create new Session
    createSession: async (sessionData) => {
        try {
            console.log('Creating Session:', sessionData);

            const response = await fetch(`${API_URL}api/sessions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(sessionData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create session');
            }

            return data;
        } catch (error) {
            console.log('Create session error:', error);
            throw error;
        }
    },

    // Update Session
    updateSession: async (sessionId, sessionData) => {
        try {
            console.log('Updating session:', sessionId, sessionData);

            const response = await fetch(`${API_URL}api/sessions/${sessionId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(sessionData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update session');
            }

            return data;
        } catch (error) {
            console.log('Update session error:', error);
            throw error
        }
    },

    // Delete Session
    deleteSession: async (sessionId) => {
        try {
            console.log('Deleting session:', sessionId);

            const response = await fetch(`${API_URL}api/sessions/${sessionId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete session');
            }

            return data;
        } catch (error) {
            console.log('Delete session error', error);
            throw error;
        }
    },

    // Create a session item (lap)
    createSessionItem: async (sessionId, itemData) => {
        try {
            console.log('Creating session item for session:', sessionId, itemData);

            const response = await fetch(`${API_URL}api/sessions/${sessionId}/items`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(itemData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create session item');
            }

            return data;
        } catch (error) {
            console.log('Create session item error:', error);
            throw error;
        }
    },


}