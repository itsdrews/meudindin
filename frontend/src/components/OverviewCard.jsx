import React from 'react';
import styled, { useTheme } from 'styled-components';
import { Card } from './ui/Card';

// Utils
const formatCurrency = (value) => {
  if (value === null || value === undefined || isNaN(Number(value))) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value));
};

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
  max-width: 800px; /* +20px de largura */
`;

const SectionTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 12px;
`;

const Overview = styled(Card)`
  width: 150%;
  padding: ${props => props.theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const TopRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const IconWrap = styled.div`
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  flex: 0 0 auto;
  box-shadow: 0 4px 6px rgba(102, 126, 234, 0.25);
`;

const Subtitle = styled.span`
  display: block;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
`;

const Total = styled.div`
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #0f172a;
`;

const TotalRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 4px;
`;

const Growth = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  color: ${props => (props.negative ? props.theme.colors.danger : props.theme.colors.success)};
  background: ${props => (props.negative ? `${props.theme.colors.danger}10` : `${props.theme.colors.success}15`)};
  border: 1px solid ${props => (props.negative ? `${props.theme.colors.danger}30` : `${props.theme.colors.success}30`)};
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.875rem;
`;

const BottomRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.xl};
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const StatLabel = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
`;

const Dot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.color || '#000'};
  flex: 0 0 auto;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.color || '#0f172a'};
`;

const ArrowUp = (props) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M7 14l5-5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const WalletIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 7.5a2.5 2.5 0 012.5-2.5H17a2 2 0 110 4H5.5A2.5 2.5 0 013 7.5z" fill="currentColor" opacity="0.9"/>
    <rect x="3" y="8" width="18" height="11" rx="2.5" fill="currentColor" opacity="0.9"/>
    <circle cx="17.5" cy="13.5" r="1.5" fill="#fff"/>
  </svg>
);

const OverviewCard = ({
  titulo = 'Visão Geral',
  saldo = 20050.15,
  receitas = 6538.55,
  despesas = 1619.43,
  variacaoPercent = 12.5,
}) => {
  const theme = useTheme();
  const negative = Number(variacaoPercent) < 0;

  return (
    <Section>
      <SectionTitle>{titulo}</SectionTitle>
      <Overview>
        <TopRow>
          <Left>
            <IconWrap>
              <WalletIcon />
            </IconWrap>
            <div>
              <Subtitle>Saldo Total</Subtitle>
              <TotalRow>
                <Total>{formatCurrency(saldo)}</Total>
                <Growth negative={negative}>
                  <ArrowUp style={{ transform: negative ? 'rotate(180deg)' : 'none' }} />
                  {negative ? '' : '+'}{Number(variacaoPercent).toFixed(1)}%
                </Growth>
              </TotalRow>
            </div>
          </Left>
        </TopRow>

        <BottomRow>
          <Stat>
            <StatLabel>
              <Dot color={theme.colors.success} />
              Receitas
            </StatLabel>
            <StatValue color={theme.colors.success}>{formatCurrency(receitas)}</StatValue>
          </Stat>
          <Stat>
            <StatLabel>
              <Dot color={theme.colors.danger} />
              Despesas
            </StatLabel>
            <StatValue color={theme.colors.danger}>{formatCurrency(despesas)}</StatValue>
          </Stat>
        </BottomRow>
      </Overview>
    </Section>
  );
};

export default OverviewCard;
