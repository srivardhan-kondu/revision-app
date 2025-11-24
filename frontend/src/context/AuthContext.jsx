import { createContext, useContext, useEffect, useState } from 'react';
import api, { attachToken } from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('sr_user');
        return stored ? JSON.parse(stored) : null;
    });
    const [token, setToken] = useState(() => localStorage.getItem('sr_token'));

    useEffect(() => {
        attachToken(token);
    }, [token]);

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        const { token: t, user: u } = res.data;
        setUser(u);
        setToken(t);
        localStorage.setItem('sr_user', JSON.stringify(u));
        localStorage.setItem('sr_token', t);
    };

    const register = async (name, email, password) => {
        const res = await api.post('/auth/register', { name, email, password });
        const { token: t, user: u } = res.data;
        setUser(u);
        setToken(t);
        localStorage.setItem('sr_user', JSON.stringify(u));
        localStorage.setItem('sr_token', t);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('sr_user');
        localStorage.removeItem('sr_token');
    };

    const value = { user, token, login, register, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
