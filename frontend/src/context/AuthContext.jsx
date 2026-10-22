import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user_info');
    return saved ? JSON.parse(saved) : {
      id: 1,
      username: 'john_doe',
      email: 'john@example.com',
      fullName: 'John Doe',
      token: 'mock-jwt-token-aetheris-8849'
    };
  });

  const [token, setToken] = useState(() => localStorage.getItem('jwt_token') || 'mock-jwt-token-aetheris-8849');
  const [isMockMode, setIsMockMode] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user_info', JSON.stringify(user));
    } else {
      localStorage.removeItem('user_info');
    }
  }, [user]);

  const login = async (username, password) => {
    const res = await apiService.login(username, password);
    setUser(res.data);
    setToken(res.data.token);
    setIsMockMode(res.isMock);
    return res;
  };

  const register = async (username, email, password, fullName) => {
    return await apiService.register(username, email, password, fullName);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_info');
  };

  return (
    <AuthContext.Provider value={{ user, token, isMockMode, login, register, logout, setIsMockMode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
