import React from 'react';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GlobalStyles } from './styles/GlobalStyles';
import { theme } from './styles/theme';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Home from './pages/Home/Home';
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
        element={!user ? <Login /> : <Navigate to="/home" />} 
      />
      <Route 
        path="/register" 
        element={!user ? <Register /> : <Navigate to="/home" />} 
      />
      <Route 
        path="/home" 
        element={user ? <Home /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/" 
        element={<Navigate to={user ? "/home" : "/login"} />} 
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