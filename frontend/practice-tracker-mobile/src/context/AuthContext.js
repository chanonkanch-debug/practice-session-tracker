// **What is Context?**
// - Global state accessible from any component
// - Avoids "prop drilling" (passing props through many components)
// - Perfect for auth state (user needs to be accessible everywhere)

import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi, setAuthToken, clearAuthToken, API_URL } from '../services/AuthApi';

// create context
export const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    //check for stored authToken on app start
    useEffect(() => {
        checkStoredToken();
    }, []);

    // Check if we have a stored token
    const checkStoredToken = async () => {
        try {
            console.log('Checking for stored token...');
            const token = await AsyncStorage.getItem('authToken');
            console.log('Token found:', token ? 'Yes' : 'No');

            if (token) {
                // Set token in API service
                setAuthToken(token);

                console.log('Verifying token with backend...');
                console.log('Calling:', `${API_URL}/auth/me`);  // Add this to see URL

                // Verify token is still valid by getting user data
                const userData = await authApi.getCurrentUser();

                console.log('User data received:', userData);

                setUser(userData.user);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.log('Token verification failed:', error);
            console.log('Error details:', error.message);
            // Token invalid, clear it
            await AsyncStorage.removeItem('authToken');
        } finally {
            setIsLoading(false);
        }
    };

    //login function
    const login = async (email, password) => {
        try {
            const response = await authApi.login(email, password);

            // store auth token in AsyncStorage for the login session
            await AsyncStorage.setItem('authToken', response.token);

            setUser(response.user);
            setIsAuthenticated(true);

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    //register function
    const register = async (email, username, password) => {
        try {
            const response = await authApi.register(email, username, password);

            return { success: true, message: 'Registration successful! Please login.' }
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    //logout function
    const logout = async () => {
        try {
            //remove token from AsyncStorage
            await AsyncStorage.removeItem('authToken');

            //clear token from api service
            clearAuthToken();

            //clear user state
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.log('Logout error:', error);
        }
    };

    // context value (functions and value provided)
    const value = {
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};