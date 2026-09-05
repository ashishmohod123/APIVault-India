import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('apivault_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('apivault_token'));
  const [activeApiKey, setActiveApiKey] = useState(() => {
    return localStorage.getItem('apivault_active_key') || 'vault_live_ashish_998271049102';
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (token) {
        try {
          const userData = await api.getMe();
          setUser(userData);
          localStorage.setItem('apivault_user', JSON.stringify(userData));
        } catch {
          // Token expired or offline
        }
      }
      setLoading(false);
    }
    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    setToken(res.access_token);
    setUser(res.user);
    localStorage.setItem('apivault_token', res.access_token);
    localStorage.setItem('apivault_user', JSON.stringify(res.user));
    return res.user;
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    setToken(res.access_token);
    setUser(res.user);
    localStorage.setItem('apivault_token', res.access_token);
    localStorage.setItem('apivault_user', JSON.stringify(res.user));
    return res.user;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('apivault_token');
    localStorage.removeItem('apivault_user');
  };

  const switchDemoUser = async (email) => {
    try {
      const u = await login(email, 'password123');
      if (email === 'ashish@apivault.in') {
        setActiveApiKey('vault_live_ashish_998271049102');
        localStorage.setItem('apivault_active_key', 'vault_live_ashish_998271049102');
      } else {
        setActiveApiKey('vault_live_amit_771829048192');
        localStorage.setItem('apivault_active_key', 'vault_live_amit_771829048192');
      }
      return u;
    } catch (err) {
      console.error('Failed to switch demo account:', err);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      switchDemoUser,
      activeApiKey,
      setActiveApiKey,
      isAdmin: user?.role === 'SUPER_ADMIN',
      isDeveloper: user?.role === 'DEVELOPER'
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
