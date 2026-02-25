import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initialize user state if token exists. Since our backend sends user data upon login,
        // we'll simply parse token or keep user info from localStorage if available.
        const storedUser = localStorage.getItem('user');
        if (storedUser && token) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed parsing stored user");
            }
        }
        setLoading(false);
    }, [token]);

    const login = async (credentials) => {
        const response = await authService.login(credentials);
        if (response.data.success) {
            const { token, data } = response.data;
            setToken(token);
            setUser(data);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(data));
        }
        return response.data;
    };

    const register = async (userData) => {
        const response = await authService.register(userData);
        return response.data;
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, register, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
