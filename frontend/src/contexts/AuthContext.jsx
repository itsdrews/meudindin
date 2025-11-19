import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('financial_token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      
      // Salva o token JWT retornado pelo backend (fallback para flag)
      if (!response.token) {
        throw new Error("Resposta inválida do servidor: token não enviado.");
      }

      localStorage.setItem("financial_token", response.token);
      localStorage.setItem('user', JSON.stringify(response.cliente));
      
      setUser(response.cliente);
      return response;
    } catch (error) {
    // Erro mais específico baseado na resposta do backend
        const errorMessage = error.response?.data?.erro || 'Erro ao fazer login';
        throw new Error(errorMessage);
    }
    };

  const register = async (userData) => {
    try {
        const response = await authService.register(userData);
        return response;
    } catch (error) {
        const errorMessage = error.response?.data?.erro || 'Erro ao criar conta';
        throw new Error(errorMessage);
    }
    };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};