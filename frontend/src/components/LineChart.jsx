import React, { useState, useMemo } from 'react';
import styled, { useTheme } from 'styled-components';
import { Card } from './ui/Card';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ChartContainer = styled(Card)`
  padding: ${props => props.theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${props => props.theme.spacing.md};
  gap: 16px;
  flex-wrap: wrap;
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ChartTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
`;

const FilterSection = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 8px;
  background: #f8fafc;
  padding: 4px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
`;

const FilterButton = styled.button`
  padding: 6px 14px;
  border: none;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.$active ? 'white' : 'transparent'};
  color: ${props => props.$active ? '#667eea' : '#64748b'};
  box-shadow: ${props => props.$active ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none'};

  &:hover {
    background: white;
    color: #667eea;
  }
`;

const Select = styled.select`
  padding: 6px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 500;
  color: #475569;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #cbd5e1;
  }

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const ChartWrapper = styled.div`
  width: 100%;
  height: 350px;
`;

const CustomTooltip = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const TooltipLabel = styled.p`
  color: #0f172a;
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 0.875rem;
`;

const TooltipItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 4px 0;
  font-size: 0.875rem;
`;

const TooltipDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.color};
`;

const TooltipValue = styled.span`
  color: #64748b;
`;

const CustomTooltipContent = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <CustomTooltip>
        <TooltipLabel>{label}</TooltipLabel>
        {payload.map((entry, index) => (
          <TooltipItem key={index}>
            <TooltipDot color={entry.color} />
            <TooltipValue>
              <strong>{entry.name}:</strong> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(entry.value)}
            </TooltipValue>
          </TooltipItem>
        ))}
      </CustomTooltip>
    );
  }
  return null;
};

// Dados mockados para diferentes períodos
const generateMockData = (period, range) => {
  const data = {
    daily: {
      5: [
        { label: 'Seg', receitas: 850, despesas: 420 },
        { label: 'Ter', receitas: 920, despesas: 380 },
        { label: 'Qua', receitas: 780, despesas: 450 },
        { label: 'Qui', receitas: 1100, despesas: 520 },
        { label: 'Sex', receitas: 950, despesas: 390 }
      ],
      10: Array.from({ length: 10 }, (_, i) => ({
        label: `Dia ${i + 1}`,
        receitas: Math.floor(Math.random() * 500) + 700,
        despesas: Math.floor(Math.random() * 300) + 300
      })),
      15: Array.from({ length: 15 }, (_, i) => ({
        label: `Dia ${i + 1}`,
        receitas: Math.floor(Math.random() * 500) + 700,
        despesas: Math.floor(Math.random() * 300) + 300
      })),
      30: Array.from({ length: 30 }, (_, i) => ({
        label: `Dia ${i + 1}`,
        receitas: Math.floor(Math.random() * 500) + 700,
        despesas: Math.floor(Math.random() * 300) + 300
      }))
    },
    weekly: {
      1: [{ label: 'Sem 1', receitas: 5200, despesas: 2800 }],
      2: [
        { label: 'Sem 1', receitas: 4800, despesas: 2600 },
        { label: 'Sem 2', receitas: 5200, despesas: 2800 }
      ],
      3: [
        { label: 'Sem 1', receitas: 4600, despesas: 2500 },
        { label: 'Sem 2', receitas: 4800, despesas: 2600 },
        { label: 'Sem 3', receitas: 5200, despesas: 2800 }
      ],
      4: [
        { label: 'Sem 1', receitas: 4400, despesas: 2400 },
        { label: 'Sem 2', receitas: 4600, despesas: 2500 },
        { label: 'Sem 3', receitas: 4800, despesas: 2600 },
        { label: 'Sem 4', receitas: 5200, despesas: 2800 }
      ]
    },
    monthly: {
      1: [{ label: 'Mês 1', receitas: 6500, despesas: 3500 }],
      2: [
        { label: 'Mês 1', receitas: 6000, despesas: 3200 },
        { label: 'Mês 2', receitas: 6500, despesas: 3500 }
      ],
      3: [
        { label: 'Jan', receitas: 5800, despesas: 3100 },
        { label: 'Fev', receitas: 6000, despesas: 3200 },
        { label: 'Mar', receitas: 6500, despesas: 3500 }
      ],
      6: [
        { label: 'Jan', receitas: 4200, despesas: 2800 },
        { label: 'Fev', receitas: 3800, despesas: 3100 },
        { label: 'Mar', receitas: 5100, despesas: 2900 },
        { label: 'Abr', receitas: 4600, despesas: 3300 },
        { label: 'Mai', receitas: 5500, despesas: 3000 },
        { label: 'Jun', receitas: 6500, despesas: 3500 }
      ]
    },
    yearly: {
      1: [{ label: '2024', receitas: 78000, despesas: 42000 }],
      2: [
        { label: '2023', receitas: 72000, despesas: 38000 },
        { label: '2024', receitas: 78000, despesas: 42000 }
      ],
      3: [
        { label: '2022', receitas: 68000, despesas: 36000 },
        { label: '2023', receitas: 72000, despesas: 38000 },
        { label: '2024', receitas: 78000, despesas: 42000 }
      ]
    }
  };

  return data[period]?.[range] || data.monthly[6];
};

const periodOptions = {
  daily: [
    { value: 5, label: 'Últimos 5 dias' },
    { value: 10, label: 'Últimos 10 dias' },
    { value: 15, label: 'Últimos 15 dias' },
    { value: 30, label: 'Últimos 30 dias' }
  ],
  weekly: [
    { value: 1, label: 'Última semana' },
    { value: 2, label: 'Últimas 2 semanas' },
    { value: 3, label: 'Últimas 3 semanas' },
    { value: 4, label: 'Últimas 4 semanas' }
  ],
  monthly: [
    { value: 1, label: 'Último mês' },
    { value: 2, label: 'Últimos 2 meses' },
    { value: 3, label: 'Últimos 3 meses' },
    { value: 6, label: 'Últimos 6 meses' }
  ],
  yearly: [
    { value: 1, label: 'Último ano' },
    { value: 2, label: 'Últimos 2 anos' },
    { value: 3, label: 'Últimos 3 anos' }
  ]
};
const mergeRealData = (receitas, despesas) => {
  const map = {};

  receitas.forEach(item => {
    map[item.name] = {
      label: item.name,
      receitas: item.value,
      despesas: 0
    };
  });

  despesas.forEach(item => {
    if (!map[item.name]) {
      map[item.name] = {
        label: item.name,
        receitas: 0,
        despesas: item.value
      };
    } else {
      map[item.name].despesas = item.value;
    }
  });

  return Object.values(map);
};
const LineChart = ({ receitasData = [], despesasData = [] }) => {
  const theme = useTheme();
  const [periodType, setPeriodType] = useState('monthly');
  const [periodRange, setPeriodRange] = useState(6);

  // -----------------------------------------------------------
  // 1) Função que calcula o RANGE de datas (início/fim)
  // -----------------------------------------------------------
  const getPeriodDateRange = (type, range) => {
    const now = new Date();
    let start;

    switch (type) {
      case "daily":
        start = new Date(now);
        start.setDate(start.getDate() - range);
        break;

      case "weekly":
        start = new Date(now);
        start.setDate(start.getDate() - range * 7);
        break;

      case "monthly":
        start = new Date(now);
        start.setMonth(start.getMonth() - range);
        break;

      case "yearly":
        start = new Date(now);
        start.setFullYear(start.getFullYear() - range);
        break;

      default:
        return null;
    }

    return { start, end: now };
  };

  // -----------------------------------------------------------
  // 2) Função que gera UMA CHAVE de agrupamento (dia, semana, mês, ano)
  // -----------------------------------------------------------
  const getGroupKey = (date, type) => {
    const d = new Date(date);

    if (type === "daily") {
      return d.toLocaleDateString("pt-BR");
    }

    if (type === "weekly") {
      const week = Math.ceil(d.getDate() / 7);
      return `${d.getMonth() + 1}/${week}`;
    }

    if (type === "monthly") {
      return `${d.getMonth() + 1}/${d.getFullYear()}`;
    }

    if (type === "yearly") {
      return `${d.getFullYear()}`;
    }
  };

  // -----------------------------------------------------------
  // 3) Filtrar e agrupar dados reais
  // -----------------------------------------------------------
  const buildRealChartData = () => {
    const hasReal = receitasData.length > 0 || despesasData.length > 0;
    if (!hasReal) return null;

    const { start, end } = getPeriodDateRange(periodType, periodRange);

    const groupMap = {};

    const process = (arr, typeKey) => {
      arr.forEach(item => {
        if (!item.data) return;

        const dataItem = new Date(item.data);
        if (dataItem < start || dataItem > end) return;

        const group = getGroupKey(item.data, periodType);

        if (!groupMap[group]) {
          groupMap[group] = { label: group, receitas: 0, despesas: 0 };
        }

        const value = Number(item.valor || item.value || 0);

        if (typeKey === "receitas") groupMap[group].receitas += value;
        else groupMap[group].despesas += value;
      });
    };

    process(receitasData, "receitas");
    process(despesasData, "despesas");

    return Object.values(groupMap).sort((a, b) =>
      new Date(a.label) - new Date(b.label)
    );
  };

  // -----------------------------------------------------------
  // 4) Decide se usa dados reais ou mockados
  // -----------------------------------------------------------
  const chartData = useMemo(() => {
    const real = buildRealChartData();
    if (real && real.length > 0) return real;

    // fallback para mock
    return generateMockData(periodType, periodRange);
  }, [periodType, periodRange, receitasData, despesasData]);

  // -----------------------------------------------------------
  // 5) Handler para trocar período
  // -----------------------------------------------------------
  const handlePeriodTypeChange = (type) => {
    setPeriodType(type);
    setPeriodRange(periodOptions[type][0].value);
  };

  return (
    <ChartContainer>
      <ChartHeader>
        <HeaderLeft>
          <ChartTitle>Receitas vs Despesas</ChartTitle>

          <FilterSection>
            <FilterGroup>
              <FilterButton $active={periodType === 'daily'} onClick={() => handlePeriodTypeChange('daily')}>
                Diário
              </FilterButton>
              <FilterButton $active={periodType === 'weekly'} onClick={() => handlePeriodTypeChange('weekly')}>
                Semanal
              </FilterButton>
              <FilterButton $active={periodType === 'monthly'} onClick={() => handlePeriodTypeChange('monthly')}>
                Mensal
              </FilterButton>
              <FilterButton $active={periodType === 'yearly'} onClick={() => handlePeriodTypeChange('yearly')}>
                Anual
              </FilterButton>
            </FilterGroup>

            <Select value={periodRange} onChange={(e) => setPeriodRange(Number(e.target.value))}>
              {periodOptions[periodType].map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FilterSection>
        </HeaderLeft>
      </ChartHeader>

      <ChartWrapper>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />

            <XAxis dataKey="label" stroke="#64748b" style={{ fontSize: '0.875rem' }} />

            <YAxis
              stroke="#64748b"
              style={{ fontSize: '0.875rem' }}
              tickFormatter={(value) => `R$ ${(value / 1000).toFixed(1)}k`}
            />

            <Tooltip content={<CustomTooltipContent />} />

            <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '0.875rem' }} iconType="circle" />

            <Line type="monotone" dataKey="receitas" name="Receitas" stroke="#10b981" strokeWidth={3}
              dot={{ fill: '#10b981', r: 5 }} activeDot={{ r: 7 }}
            />

            <Line type="monotone" dataKey="despesas" name="Despesas" stroke="#ef4444" strokeWidth={3}
              dot={{ fill: '#ef4444', r: 5 }} activeDot={{ r: 7 }}
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </ChartWrapper>
    </ChartContainer>
  );
};


export default LineChart;
