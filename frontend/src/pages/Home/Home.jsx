import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import OverviewCard from '../../components/OverviewCard';
import LineChart from '../../components/LineChart';
import SourcesChart from '../../components/SourcesChart';

const HomeContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.darkMode ? '#1a0b2e' : '#f5f7fa'};
  display: flex;
  transition: background 0.3s ease;
`;

const Sidebar = styled.aside`
  width: 270px;
  background: ${props => props.darkMode ? '#2d1b4e' : 'white'};
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 2px 0 8px rgba(0, 0, 0, ${props => props.darkMode ? '0.3' : '0.04'});
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
  color: ${props => props.darkMode ? '#f8fafc' : '#0f172a'};
  margin: 0;
  transition: color 0.3s ease;
`;

const LogoSubtitle = styled.p`
  font-size: 0.75rem;
  color: ${props => props.darkMode ? '#a78bfa' : '#64748b'};
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
  background: ${props => props.active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent'};
  color: ${props => props.active ? 'white' : props.darkMode ? '#c4b5fd' : '#64748b'};
  font-size: 0.95rem;
  font-weight: ${props => props.active ? '600' : '500'};
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;

  &:hover {
    background: ${props => props.active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : props.darkMode ? 'rgba(139, 92, 246, 0.1)' : '#f8fafc'};
    color: ${props => props.active ? 'white' : props.darkMode ? '#f8fafc' : '#0f172a'};
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
  background: ${props => props.darkMode ? '#2d1b4e' : 'white'};
  padding: 20px 32px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-bottom: 1px solid ${props => props.darkMode ? '#4c1d95' : '#e2e8f0'};
  box-shadow: 0 1px 3px rgba(0, 0, 0, ${props => props.darkMode ? '0.3' : '0.04'});
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
  border: 1px solid ${props => props.darkMode ? '#4c1d95' : '#e2e8f0'};
  border-radius: 10px;
  background: ${props => props.darkMode ? '#3b2167' : 'white'};
  color: ${props => props.darkMode ? '#c4b5fd' : '#64748b'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1.2rem;

  &:hover {
    background: ${props => props.darkMode ? '#4c1d95' : '#f8fafc'};
    border-color: ${props => props.darkMode ? '#6d28d9' : '#cbd5e1'};
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 32px;
  overflow-y: auto;
`;

const PageTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${props => props.darkMode ? '#f8fafc' : '#0f172a'};
  margin: 0 0 8px 0;
  transition: color 0.3s ease;
`;

const PageSubtitle = styled.p`
  font-size: 0.95rem;
  color: ${props => props.darkMode ? '#a78bfa' : '#64748b'};
  margin: 0 0 32px 0;
  transition: color 0.3s ease;
`;

const ContentStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const BalanceCard = styled.div`
  background: ${props => props.darkMode ? 'linear-gradient(135deg, #3b2167 0%, #2d1b4e 100%)' : 'white'};
  border-radius: 20px;
  padding: 28px 32px;
  box-shadow: ${props => props.darkMode ? '0 8px 24px rgba(0, 0, 0, 0.4)' : '0 2px 12px rgba(0, 0, 0, 0.08)'};
  border: 1px solid ${props => props.darkMode ? '#4c1d95' : '#e2e8f0'};
  position: relative;
  transition: all 0.3s ease;
`;

const BalanceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

const BalanceLeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const BalanceIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
`;

const BalanceInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const BalanceLabel = styled.p`
  font-size: 0.875rem;
  color: ${props => props.darkMode ? '#a78bfa' : '#64748b'};
  margin: 0;
  font-weight: 500;
  transition: color 0.3s ease;
`;

const BalanceValue = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.darkMode ? '#f8fafc' : '#0f172a'};
  margin: 0;
  transition: color 0.3s ease;
  cursor: pointer;
  user-select: none;
  
  &:hover {
    opacity: 0.8;
  }
`;

const DistributionDropdown = styled.div`
  margin-top: 16px;
  background: ${props => props.darkMode ? 'rgba(59, 33, 103, 0.6)' : '#f8fafc'};
  border-radius: 12px;
  padding: 16px;
  border: 1px solid ${props => props.darkMode ? '#4c1d95' : '#e2e8f0'};
  animation: slideDown 0.3s ease;
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const DistributionTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.darkMode ? '#c4b5fd' : '#475569'};
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DistributionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid ${props => props.darkMode ? 'rgba(76, 29, 149, 0.5)' : '#e2e8f0'};
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
  
  &:first-child {
    padding-top: 0;
  }
`;

const DistributionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const DistributionIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
`;

const DistributionLabel = styled.span`
  font-size: 0.875rem;
  color: ${props => props.darkMode ? '#e0e7ff' : '#475569'};
  font-weight: 500;
`;

const DistributionValues = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
`;

const DistributionPercent = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.darkMode ? '#a78bfa' : '#667eea'};
`;

const DistributionAmount = styled.span`
  font-size: 0.75rem;
  color: ${props => props.darkMode ? '#94a3b8' : '#64748b'};
`;

const GrowthBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  background: ${props => props.darkMode ? 'rgba(16, 185, 129, 0.15)' : '#d1fae5'};
  color: #10b981;
  padding: 11px 17px;
  border-radius: 20px;
  font-size: 0.9375rem;
  font-weight: 600;
  transition: all 0.3s ease;
`;

const EyeIcon = styled.button`
  position: absolute;
  top: 28px;
  right: 32px;
  background: transparent;
  border: none;
  color: ${props => props.darkMode ? '#a78bfa' : '#64748b'};
  cursor: pointer;
  font-size: 1.25rem;
  transition: color 0.2s ease;

  &:hover {
    color: ${props => props.darkMode ? '#c4b5fd' : '#475569'};
  }
`;

const StatsRow = styled.div`
  display: flex;
  gap: 48px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid ${props => props.darkMode ? '#4c1d95' : '#e2e8f0'};
  transition: border-color 0.3s ease;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 10px;
  transition: all 0.2s ease;
  background: ${props => props.selected ? (props.darkMode ? 'rgba(139, 92, 246, 0.15)' : '#f8fafc') : 'transparent'};
  border: 2px solid ${props => props.selected ? (props.type === 'receitas' ? '#10b981' : '#ef4444') : 'transparent'};
  
  &:hover {
    background: ${props => props.darkMode ? 'rgba(139, 92, 246, 0.1)' : '#f8fafc'};
  }
`;

const StatDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.color};
`;

const StatInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const StatLabel = styled.span`
  font-size: 0.875rem;
  color: ${props => props.darkMode ? '#a78bfa' : '#64748b'};
  font-weight: 500;
  transition: color 0.3s ease;
`;

const StatValue = styled.span`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.color};
`;

const Home = () => {
  const { user, logout } = useAuth();
  const [activeNav, setActiveNav] = useState('overview');
  const [darkMode, setDarkMode] = useState(false);
  const [showDistribution, setShowDistribution] = useState(false);
  const [showReceitas, setShowReceitas] = useState(false);
  const [showDespesas, setShowDespesas] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };
  
  const toggleDistribution = () => {
    setShowDistribution(!showDistribution);
  };
  
  const toggleReceitas = () => {
    setShowReceitas(!showReceitas);
  };
  
  const toggleDespesas = () => {
    setShowDespesas(!showDespesas);
  };
  
  const distributionData = [
    { id: 1, label: 'Dinheiro em espécie', percent: 10, amount: 2005.02, icon: '💵', color: '#10b981' },
    { id: 2, label: 'Conta Corrente Bradesco', percent: 20, amount: 4010.03, icon: '🏦', color: '#3b82f6' },
    { id: 3, label: 'Poupança Caixa', percent: 30, amount: 6015.05, icon: '🐷', color: '#f59e0b' },
    { id: 4, label: 'Investimentos', percent: 40, amount: 8020.05, icon: '📈', color: '#8b5cf6' }
  ];

  return (
    <HomeContainer darkMode={darkMode}>
      <Sidebar darkMode={darkMode}>
        <Logo>
          <LogoIcon>💰</LogoIcon>
          <LogoText>
            <LogoTitle darkMode={darkMode}>MeuDinDin</LogoTitle>
            <LogoSubtitle darkMode={darkMode}>Finanças Inteligentes</LogoSubtitle>
          </LogoText>
        </Logo>

        <NavItem 
          active={activeNav === 'overview'} 
          darkMode={darkMode}
          onClick={() => setActiveNav('overview')}
        >
          <NavIcon>📊</NavIcon>
          Visão Geral
        </NavItem>

        <NavItem 
          active={activeNav === 'transactions'} 
          darkMode={darkMode}
          onClick={() => setActiveNav('transactions')}
        >
          <NavIcon>💳</NavIcon>
          Transações
        </NavItem>

        <NavItem 
          active={activeNav === 'accounts'} 
          darkMode={darkMode}
          onClick={() => setActiveNav('accounts')}
        >
          <NavIcon>🏦</NavIcon>
          Contas
        </NavItem>

        <NavItem 
          active={activeNav === 'goals'} 
          darkMode={darkMode}
          onClick={() => setActiveNav('goals')}
        >
          <NavIcon>🎯</NavIcon>
          Metas
        </NavItem>

        <NavDivider />

        <LogoutNav darkMode={darkMode} onClick={handleLogout}>
          <NavIcon>🚪</NavIcon>
          Sair
        </LogoutNav>
      </Sidebar>

      <Content>
        <TopBar darkMode={darkMode}>
          <TopBarActions>
            <IconButton darkMode={darkMode} title="Notificações">
              🔔
            </IconButton>
            <IconButton darkMode={darkMode} title="Alternar Tema" onClick={toggleTheme}>
              {darkMode ? '☀️' : '🌙'}
            </IconButton>
          </TopBarActions>
        </TopBar>

        <MainContent>
          <PageTitle darkMode={darkMode}>Visão Geral</PageTitle>
          <PageSubtitle darkMode={darkMode}>Acompanhe suas finanças em tempo real</PageSubtitle>

          <ContentStack>
            <BalanceCard darkMode={darkMode}>
              <BalanceHeader>
                <BalanceLeftSection>
                  <BalanceIcon>💳</BalanceIcon>
                  <BalanceInfo>
                    <BalanceLabel darkMode={darkMode}>Saldo Total</BalanceLabel>
                    <BalanceValue darkMode={darkMode} onClick={toggleDistribution}>
                      R$ 20.050,15
                    </BalanceValue>
                    {showDistribution && (
                      <DistributionDropdown darkMode={darkMode}>
                        <DistributionTitle darkMode={darkMode}>Distribuição do Saldo</DistributionTitle>
                        {distributionData.map(item => (
                          <DistributionItem key={item.id} darkMode={darkMode}>
                            <DistributionInfo>
                              <DistributionIcon color={item.color}>{item.icon}</DistributionIcon>
                              <DistributionLabel darkMode={darkMode}>{item.label}</DistributionLabel>
                            </DistributionInfo>
                            <DistributionValues>
                              <DistributionPercent darkMode={darkMode}>{item.percent}%</DistributionPercent>
                              <DistributionAmount darkMode={darkMode}>
                                R$ {item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </DistributionAmount>
                            </DistributionValues>
                          </DistributionItem>
                        ))}
                      </DistributionDropdown>
                    )}
                  </BalanceInfo>
                </BalanceLeftSection>
                <GrowthBadge darkMode={darkMode}>
                  <span style={{ fontSize: '1.125rem' }}>↗</span> +12,5%
                </GrowthBadge>
              </BalanceHeader>
              <StatsRow darkMode={darkMode}>
                <StatItem 
                  selected={showReceitas} 
                  darkMode={darkMode}
                  type="receitas"
                  onClick={toggleReceitas}
                >
                  <StatDot color="#10b981" />
                  <StatInfo>
                    <StatLabel darkMode={darkMode}>Receitas</StatLabel>
                    <StatValue color="#10b981">R$ 6.538,55</StatValue>
                  </StatInfo>
                </StatItem>
                <StatItem 
                  selected={showDespesas}
                  darkMode={darkMode}
                  type="despesas"
                  onClick={toggleDespesas}
                >
                  <StatDot color="#ef4444" />
                  <StatInfo>
                    <StatLabel darkMode={darkMode}>Despesas</StatLabel>
                    <StatValue color="#ef4444">R$ 1.619,43</StatValue>
                  </StatInfo>
                </StatItem>
              </StatsRow>
            </BalanceCard>

            {showReceitas && showDespesas && (
              <LineChart />
            )}

            {showReceitas && (
              <SourcesChart type="receitas" />
            )}

            {showDespesas && (
              <SourcesChart type="despesas" />
            )}
          </ContentStack>
        </MainContent>
      </Content>
    </HomeContainer>
  );
};

export default Home;