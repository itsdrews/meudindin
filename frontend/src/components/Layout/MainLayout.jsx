import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const LayoutContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.$darkMode ? '#1a0b2e' : '#f5f7fa'};
  display: flex;
  transition: background 0.3s ease;
`;

const Sidebar = styled.aside`
  width: 270px;
  background: ${props => props.$darkMode ? '#2d1b4e' : 'white'};
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 2px 0 8px rgba(0, 0, 0, ${props => props.$darkMode ? '0.3' : '0.04'});
  transition: all 0.3s ease;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
`;

const LogoIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

const LogoText = styled.div`
  display: flex;
  flex-direction: column;
`;

const LogoTitle = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.$darkMode ? '#f8fafc' : '#0f172a'};
  margin: 0;
  transition: color 0.3s ease;
`;

const LogoSubtitle = styled.p`
  font-size: 0.75rem;
  color: ${props => props.$darkMode ? '#a78bfa' : '#64748b'};
  margin: 0;
  transition: color 0.3s ease;
`;

const NavItem = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: none;
  border-radius: 12px;
  background: ${props => props.$active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent'};
  color: ${props => props.$active ? 'white' : props.$darkMode ? '#c4b5fd' : '#64748b'};
  font-size: 0.95rem;
  font-weight: ${props => props.$active ? '600' : '500'};
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;

  &:hover {
    background: ${props => props.$active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : props.$darkMode ? 'rgba(139, 92, 246, 0.1)' : '#f8fafc'};
    color: ${props => props.$active ? 'white' : props.$darkMode ? '#f8fafc' : '#0f172a'};
  }
`;

const NavIcon = styled.span`
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NavDivider = styled.div`
  flex: 1;
`;

const LogoutNav = styled(NavItem)`
  margin-top: auto;
  color: #ef4444;

  &:hover {
    background: #fef2f2;
    color: #dc2626;
  }
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const TopBar = styled.div`
  background: ${props => props.$darkMode ? '#2d1b4e' : 'white'};
  padding: 20px 32px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-bottom: 1px solid ${props => props.$darkMode ? '#4c1d95' : '#e2e8f0'};
  box-shadow: 0 1px 3px rgba(0, 0, 0, ${props => props.$darkMode ? '0.3' : '0.04'});
  transition: all 0.3s ease;
`;

const TopBarActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const IconButton = styled.button`
  width: 40px;
  height: 40px;
  border: 1px solid ${props => props.$darkMode ? '#4c1d95' : '#e2e8f0'};
  border-radius: 10px;
  background: ${props => props.$darkMode ? '#3b2167' : 'white'};
  color: ${props => props.$darkMode ? '#c4b5fd' : '#64748b'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1.2rem;

  &:hover {
    background: ${props => props.$darkMode ? '#4c1d95' : '#f8fafc'};
    border-color: ${props => props.$darkMode ? '#6d28d9' : '#cbd5e1'};
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 32px;
  overflow-y: auto;
`;

const LogoButton = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  margin: 0;
  cursor: pointer;

  display: flex;
  align-items: center;   /* <-- garante ícone à esquerda */
  gap: 12px;

  width: 100%;
  text-align: left;

  &:hover ${LogoTitle}, &:hover ${LogoSubtitle} {
    opacity: 0.9;
  }

  &:hover ${LogoIcon} {
    transform: scale(1.05);
  }
`;


const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <LayoutContainer $darkMode={darkMode}>
      <Sidebar $darkMode={darkMode}>
        <Logo>
          <LogoButton onClick={() => navigate('/visaogeral')}>
            <LogoIcon>💰</LogoIcon>

            <LogoText>
              <LogoTitle $darkMode={darkMode}>MeuDinDin</LogoTitle>
              <LogoSubtitle $darkMode={darkMode}>Finanças Inteligentes</LogoSubtitle>
            </LogoText>
          </LogoButton>
        </Logo>

        <NavItem 
          $active={isActive('/visaogeral')} 
          $darkMode={darkMode}
          onClick={() => navigate('/visaogeral')}
        >
          <NavIcon>📊</NavIcon>
          Visão Geral
        </NavItem>

        <NavItem 
          $active={isActive('/transacoes')} 
          $darkMode={darkMode}
          onClick={() => navigate('/transacoes')}
        >
          <NavIcon>💳</NavIcon>
          Transações
        </NavItem>

        <NavItem 
          $active={isActive('/contas')} 
          $darkMode={darkMode}
          onClick={() => navigate('/contas')}
        >
          <NavIcon>🏦</NavIcon>
          Contas
        </NavItem>

        <NavItem 
          $active={isActive('/metas')} 
          $darkMode={darkMode}
          onClick={() => navigate('/metas')}
        >
          <NavIcon>🎯</NavIcon>
          Metas
        </NavItem>

        <NavDivider />

        <LogoutNav $darkMode={darkMode} onClick={handleLogout}>
          <NavIcon>🚪</NavIcon>
          Sair
        </LogoutNav>
      </Sidebar>

      <Content>
        <TopBar $darkMode={darkMode}>
          <TopBarActions>
            <IconButton 
              $darkMode={darkMode} 
              title="Meu Perfil"
              onClick={() => navigate("/perfil")}
              style={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                fontSize: "1rem",
                fontWeight: "700",
                background: darkMode 
                  ? "linear-gradient(135deg, #4c1d95, #6d28d9)" 
                  : "linear-gradient(135deg, #667eea, #764ba2)",
                color: "white"
              }}
            >
              {localStorage.getItem("user")
                ? JSON.parse(localStorage.getItem("user")).nome?.charAt(0).toUpperCase()
                : "?"}
            </IconButton>
            <IconButton $darkMode={darkMode} title="Notificações">
              🔔
            </IconButton>
            <IconButton $darkMode={darkMode} title="Alternar Tema" onClick={toggleTheme}>
              {darkMode ? '☀️' : '🌙'}
            </IconButton>
          </TopBarActions>
        </TopBar>

        <MainContent>
          {React.cloneElement(children, { darkMode })}
        </MainContent>
      </Content>
    </LayoutContainer>
  );
};

export default MainLayout;
