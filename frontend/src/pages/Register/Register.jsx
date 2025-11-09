import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { GradientButton } from '../../components/ui/GradientButton';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { useAuth } from '../../contexts/AuthContext';

const RegisterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}15 0%, ${props => props.theme.colors.background} 100%);
  padding: ${props => props.theme.spacing.xl};
`;

const RegisterCard = styled(Card)`
  width: 100%;
  max-width: 450px;
  padding: ${props => props.theme.spacing.xxl};
  position: relative;
`;

const BackButton = styled.button`
  position: absolute;
  top: ${props => props.theme.spacing.xl};
  left: ${props => props.theme.spacing.xl};
  background: none;
  border: none;
  color: ${props => props.theme.colors.text.secondary};
  cursor: pointer;
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  font-size: 0.875rem;

  &:hover {
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text.primary};
  }
`;

const WelcomeTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text.primary};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xs};
  margin-top: ${props => props.theme.spacing.md};
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
`;

const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.text.primary};
  font-weight: 500;
  font-size: 0.875rem;
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

const RegisterButton = styled(GradientButton)`
  width: 100%;
  margin-bottom: ${props => props.theme.spacing.lg};
  margin-top: ${props => props.theme.spacing.md};
`;

const LoginSection = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const LoginText = styled.span`
  color: ${props => props.theme.colors.text.secondary};
  margin-right: ${props => props.theme.spacing.sm};
`;

const LoginLink = styled(Link)`
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

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const formatCPF = (value) => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 6) {
      return numbers.replace(/(\d{3})(\d{0,3})/, '$1.$2');
    } else if (numbers.length <= 9) {
      return numbers.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3');
    } else {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
    }
  };

  const handleCPFChange = (e) => {
    const formattedCPF = formatCPF(e.target.value);
    setFormData({
      ...formData,
      cpf: formattedCPF
    });
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return false;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return false;
    }

    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (!cpfRegex.test(formData.cpf)) {
      setError('CPF inválido');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/login');
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <BackButton onClick={handleBack}>
          ← Voltar
        </BackButton>

        <CardHeader>
          <WelcomeTitle>Criar sua conta</WelcomeTitle>
          <WelcomeSubtitle>Comece sua jornada financeira hoje</WelcomeSubtitle>
        </CardHeader>

        <Divider />

        <form onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}

          <FormGroup>
            <Label htmlFor="name">Nome completo</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="João da Silva"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="cpf">CPF</Label>
            <Input
              type="text"
              id="cpf"
              name="cpf"
              value={formData.cpf}
              onChange={handleCPFChange}
              placeholder="000.000.000-00"
              maxLength="14"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Senha</Label>
            <PasswordInput
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="confirmPassword">Confirmar senha</Label>
            <PasswordInput
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </FormGroup>

          <RegisterButton 
            type="submit" 
            disabled={loading}
            size="lg"
          >
            {loading ? 'Criando conta...' : 'Criar conta'}
          </RegisterButton>
        </form>

        <Divider />

        <LoginSection>
          <LoginText>Já tem uma conta?</LoginText>
          <LoginLink to="/login">
            Fazer login
          </LoginLink>
        </LoginSection>

        <TermsText>
          Ao criar uma conta, você concorda com nossos{' '}
          <TermsLink>Termos de Serviço</TermsLink> e{' '}
          <TermsLink>Política de Privacidade</TermsLink>
        </TermsText>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default Register;