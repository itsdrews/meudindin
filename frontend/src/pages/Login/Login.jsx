import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { GradientButton } from '../../components/ui/GradientButton';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}15 0%, ${props => props.theme.colors.background} 100%);
  padding: ${props => props.theme.spacing.xl};
`;

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  padding: ${props => props.theme.spacing.xxl};
`;

const WelcomeTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text.primary};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const WelcomeSubtitle = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const Divider = styled.div`
  height: 1px;
  background: ${props => props.theme.colors.border};
  margin: ${props => props.theme.spacing.xl} 0;
  position: relative;
`;

const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.text.primary};
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 1rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.text.light};
  }
`;

const PasswordInput = styled(Input)`
  letter-spacing: 2px;
  font-weight: 600;
`;

const LoginButton = styled(GradientButton)`
  width: 100%;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const CreateAccountSection = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const CreateAccountText = styled.span`
  color: ${props => props.theme.colors.text.secondary};
  margin-right: ${props => props.theme.spacing.sm};
`;

const CreateAccountLink = styled(Link)`
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const TermsText = styled.p`
  text-align: center;
  color: ${props => props.theme.colors.text.secondary};
  font-size: 0.875rem;
  line-height: 1.4;
`;

const TermsLink = styled.span`
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  background: ${props => props.theme.colors.danger}15;
  color: ${props => props.theme.colors.danger};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: ${props => props.theme.spacing.lg};
  text-align: center;
  border: 1px solid ${props => props.theme.colors.danger}30;
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      // O redirecionamento é automático via AppRoutes quando user é definido
    } catch (err) {
      setError(err.message || 'Email ou senha inválidos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <CardHeader>
          <WelcomeTitle>Bem-vindo de volta</WelcomeTitle>
          <WelcomeSubtitle>As rédeas do seu dinheiro na palma da mão!</WelcomeSubtitle>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}

          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Senha</Label>
            <PasswordInput
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </FormGroup>

          <LoginButton 
            type="submit" 
            disabled={loading}
            size="lg"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </LoginButton>
        </form>

        <Divider />

        <CreateAccountSection>
          <CreateAccountText>Novo por aqui?</CreateAccountText>
          <CreateAccountLink to="/register">
            Criar uma conta
          </CreateAccountLink>
        </CreateAccountSection>

        <TermsText>
          Ao continuar, você concorda com nossos{' '}
          <TermsLink>Termos de Serviço</TermsLink> e{' '}
          <TermsLink>Política de Privacidade</TermsLink>
        </TermsText>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;