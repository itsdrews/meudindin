import React from 'react';
import styled, { useTheme } from 'styled-components';
import { Card } from './ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const Container = styled(Card)`
  padding: ${props => props.theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const Icon = styled.span`
  font-size: 1.5rem;
`;

const ChartWrapper = styled.div`
  width: 100%;
  height: 300px;
`;

const CustomTooltip = styled.div`
  background: ${props => props.theme.colors.card};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.md};
  box-shadow: ${props => props.theme.shadows.md};
`;

const TooltipLabel = styled.p`
  color: ${props => props.theme.colors.text.primary};
  font-weight: 600;
  margin-bottom: 4px;
  font-size: 0.875rem;
`;

const TooltipValue = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  font-size: 0.875rem;
`;

const CustomTooltipContent = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <CustomTooltip>
        <TooltipLabel>{payload[0].payload.name}</TooltipLabel>
        <TooltipValue>
          <strong>Valor:</strong> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(payload[0].value)}
        </TooltipValue>
      </CustomTooltip>
    );
  }
  return null;
};

const SourcesChart = ({ 
  type = 'receitas',
  data = []
}) => {
  const theme = useTheme();
  
  const defaultReceitasData = [
    { name: 'Salário', value: 4500, color: '#10b981' },
    { name: 'Venda de Picolé', value: 1200, color: '#14b8a6' },
    { name: 'Uber', value: 838.55, color: '#22c55e' }
  ];

  const defaultDespesasData = [
    { name: 'Lazer', value: 450, color: '#ef4444' },
    { name: 'Conta de Luz', value: 320.50, color: '#f97316' },
    { name: 'Roupa', value: 280.30, color: '#fb923c' },
    { name: 'Conta de Telefone', value: 89.90, color: '#fbbf24' },
    { name: 'Conta de Água', value: 78.73, color: '#facc15' }
  ];

  const chartData = data.length > 0 ? data : (type === 'receitas' ? defaultReceitasData : defaultDespesasData);
  const isReceitas = type === 'receitas';

  return (
    <Container>
      <Header>
        <Title>
          <Icon>{isReceitas ? '💰' : '💸'}</Icon>
          {isReceitas ? 'Principais Fontes de Receitas' : 'Principais Despesas'}
        </Title>
      </Header>

      <ChartWrapper>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={theme.colors.border}
              opacity={0.5}
            />
            <XAxis 
              dataKey="name" 
              stroke={theme.colors.text.secondary}
              style={{ fontSize: '0.875rem' }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke={theme.colors.text.secondary}
              style={{ fontSize: '0.875rem' }}
              tickFormatter={(value) => `R$ ${(value / 1000).toFixed(1)}k`}
            />
            <Tooltip content={<CustomTooltipContent />} />
            <Bar 
              dataKey="value" 
              radius={[8, 8, 0, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>
    </Container>
  );
};

export default SourcesChart;
