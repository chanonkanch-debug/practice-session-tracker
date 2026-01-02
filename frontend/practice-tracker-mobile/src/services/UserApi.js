import { API_URL, getAuthToken } from './AuthApi';

export const UserApi = {
    // Get current user profile
    getProfile: async () => {
        try {
            console.log('Fetching user profile');

            const response = await fetch(`${API_URL}api/user/profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch profile');
            }

            return data;
        } catch (error) {
            console.log('Get profile error:', error);
            throw error;
        }
    },

    // Update user profile
    updateProfile: async (updates) => {
        try {
            console.log('Updating profile:', updates);

            const response = await fetch(`${API_URL}api/user/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update profile');
            }

            return data;
        } catch (error) {
            console.log('Update profile error:', error);
            throw error;
        }
    },

    // Get user settings
    getSettings: async () => {
        try {
            console.log('Fetching user settings');

            const response = await fetch(`${API_URL}api/user/settings`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch settings');
            }

            return data;
        } catch (error) {
            console.log('Get settings error:', error);
            throw error;
        }
    },

    // Update user settings
    updateSettings: async (settings) => {
        try {
            console.log('Updating settings:', settings);

            const response = await fetch(`${API_URL}api/user/settings`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(settings),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update settings');
            }

            return data;
        } catch (error) {
            console.log('Update settings error:', error);
            throw error;
        }
    },
}