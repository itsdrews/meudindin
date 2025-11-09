import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';

const HomeContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}15 0%, ${props => props.theme.colors.background} 100%);
  padding: ${props => props.theme.spacing.xl};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  text-align: center;
  max-width: 600px;
  padding: ${props => props.theme.spacing.xxl};
`;

const WelcomeTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.md};
  background: linear-gradient(90deg, #2563eb 0%, #7c3aed 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const WelcomeSubtitle = styled.p`
  font-size: 1.25rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing.xl};
  line-height: 1.6;
`;

const UserInfo = styled.div`
  background: ${props => props.theme.colors.card};
  padding: ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  border: 1px solid ${props => props.theme.colors.border};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const UserEmail = styled.p`
  color: ${props => props.theme.colors.text.primary};
  font-size: 1.125rem;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const UserName = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  font-size: 1rem;
`;

const LogoutButton = styled(Button)`
  margin-top: ${props => props.theme.spacing.lg};
  min-width: 200px;
`;

const Home = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <HomeContainer>
      <Content>
        <WelcomeTitle>Meu DinDin 💰</WelcomeTitle>
        <WelcomeSubtitle>
          Sua jornada rumo à liberdade financeira começa aqui
        </WelcomeSubtitle>
        
        <UserInfo>
          <UserEmail>Bem-vindo, {user?.name || 'Usuário'}!</UserEmail>
          <UserName>{user?.email || 'seu@email.com'}</UserName>
        </UserInfo>

        <LogoutButton 
          variant="outline" 
          onClick={handleLogout}
          size="lg"
        >
          Sair
        </LogoutButton>
      </Content>
    </HomeContainer>
  );
};

export default Home;