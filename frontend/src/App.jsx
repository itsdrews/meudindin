import React from 'react';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GlobalStyles } from './styles/GlobalStyles';
import { theme } from './styles/theme';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Home from './pages/Home/Home';
import Transactions from './pages/Transactions';
import Contas from './pages/Contas';
import Metas from './pages/Metas';
import MainLayout from './components/Layout/MainLayout';
import styled from 'styled-components';

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.125rem;
  color: ${props => props.theme.colors.text.secondary};
`;

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <LoadingSpinner>
        Carregando...
      </LoadingSpinner>
    );
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={!user ? <Login /> : <Navigate to="/visaogeral" />} 
      />
      <Route 
        path="/register" 
        element={!user ? <Register /> : <Navigate to="/visaogeral" />} 
      />
      <Route 
        path="/visaogeral" 
        element={user ? <MainLayout><Home /></MainLayout> : <Navigate to="/login" />} 
      />
      <Route 
        path="/transacoes" 
        element={user ? <MainLayout><Transactions /></MainLayout> : <Navigate to="/login" />} 
      />
      <Route 
        path="/contas" 
        element={user ? <MainLayout><Contas /></MainLayout> : <Navigate to="/login" />} 
      />
      <Route 
        path="/metas" 
        element={user ? <MainLayout><Metas /></MainLayout> : <Navigate to="/login" />} 
      />
      <Route 
        path="/" 
        element={<Navigate to={user ? "/visaogeral" : "/login"} />} 
      />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;