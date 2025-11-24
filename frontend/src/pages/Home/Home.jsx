  import React, { useState,useEffect } from 'react';
  import styled from 'styled-components';
  import LineChart from '../../components/LineChart';
  import SourcesChart from '../../components/SourcesChart';
  import accountService from '../../services/accountService';

  const HomeContainer = styled.div`
    width: 100%;
  `;

  const PageTitle = styled.h2`
    font-size: 1.75rem;
    font-weight: 700;
    color: ${props => props.$darkMode ? '#f8fafc' : '#0f172a'};
    margin: 0 0 8px 0;
    transition: color 0.3s ease;
  `;

  const PageSubtitle = styled.p`
    font-size: 0.95rem;
    color: ${props => props.$darkMode ? '#a78bfa' : '#64748b'};
    margin: 0 0 32px 0;
    transition: color 0.3s ease;
  `;

  const ContentStack = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
  `;

  const BalanceCard = styled.div`
    background: ${props => props.$darkMode ? 'linear-gradient(135deg, #3b2167 0%, #2d1b4e 100%)' : 'white'};
    border-radius: 20px;
    padding: 28px 32px;
    box-shadow: ${props => props.$darkMode ? '0 8px 24px rgba(0, 0, 0, 0.4)' : '0 2px 12px rgba(0, 0, 0, 0.08)'};
    border: 1px solid ${props => props.$darkMode ? '#4c1d95' : '#e2e8f0'};
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
    color: ${props => props.$darkMode ? '#a78bfa' : '#64748b'};
    margin: 0;
    font-weight: 500;
    transition: color 0.3s ease;
  `;

  const BalanceValue = styled.h2`
    font-size: 2rem;
    font-weight: 700;
    color: ${props => props.$darkMode ? '#f8fafc' : '#0f172a'};
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
    background: ${props => props.$darkMode ? 'rgba(59, 33, 103, 0.6)' : '#f8fafc'};
    border-radius: 12px;
    padding: 16px;
    border: 1px solid ${props => props.$darkMode ? '#4c1d95' : '#e2e8f0'};
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
    color: ${props => props.$darkMode ? '#c4b5fd' : '#475569'};
    margin: 0 0 12px 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  `;

  const DistributionItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid ${props => props.$darkMode ? 'rgba(76, 29, 149, 0.5)' : '#e2e8f0'};
    
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
    background: ${props => props.$color};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
  `;

  const DistributionLabel = styled.span`
    font-size: 0.875rem;
    color: ${props => props.$darkMode ? '#e0e7ff' : '#475569'};
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
    color: ${props => props.$darkMode ? '#a78bfa' : '#667eea'};
  `;

  const DistributionAmount = styled.span`
    font-size: 0.75rem;
    color: ${props => props.$darkMode ? '#94a3b8' : '#64748b'};
  `;

  const GrowthBadge = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    background: ${props => props.$darkMode ? 'rgba(16, 185, 129, 0.15)' : '#d1fae5'};
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
    color: ${props => props.$darkMode ? '#a78bfa' : '#64748b'};
    cursor: pointer;
    font-size: 1.25rem;
    transition: color 0.2s ease;

    &:hover {
      color: ${props => props.$darkMode ? '#c4b5fd' : '#475569'};
    }
  `;

  const StatsRow = styled.div`
    display: flex;
    gap: 48px;
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid ${props => props.$darkMode ? '#4c1d95' : '#e2e8f0'};
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
    background: ${props => props.$selected ? (props.$darkMode ? 'rgba(139, 92, 246, 0.15)' : '#f8fafc') : 'transparent'};
    border: 2px solid ${props => props.$selected ? (props.$kind === 'receitas' ? '#10b981' : '#ef4444') : 'transparent'};
    
    &:hover {
      background: ${props => props.$darkMode ? 'rgba(139, 92, 246, 0.1)' : '#f8fafc'};
    }
  `;

  const StatDot = styled.div`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.$color};
  `;

  const StatInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
  `;

  const StatLabel = styled.span`
    font-size: 0.875rem;
    color: ${props => props.$darkMode ? '#a78bfa' : '#64748b'};
    font-weight: 500;
    transition: color 0.3s ease;
  `;

  const StatValue = styled.span`
    font-size: 1.125rem;
    font-weight: 600;
    color: ${props => props.color};
  `;

  const Home = ({ darkMode }) => {
    const [showDistribution, setShowDistribution] = useState(false);
    const [showReceitas, setShowReceitas] = useState(false);
    const [showDespesas, setShowDespesas] = useState(false);
    const [accounts, setAccounts] = useState([]);
    const [totalBalance, setTotalBalance] = useState(0);
    const [distributionData, setDistributionData] = useState([]);
    const [receitas, setReceitas] = useState(0);
    const [despesas, setDespesas] = useState(0);
    const [receitasData,setReceitasData] = useState(0);
    const [despesasData,setDespesasData] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        // 1. Buscar contas diretamente do backend (com saldo atualizado)
        const contas = await accountService.list();

        // 2. Armazenar contas no estado
        setAccounts(contas);

        // 3. Somar saldo total apenas com base nos saldos vindos do backend
        const total = contas.reduce((sum, acc) => sum + Number(acc.saldo || 0), 0);
        setTotalBalance(total);

        // 4. Montar dados de distribuição por conta
        const distData = contas
          .map(acc => {
            const percent = total > 0 ? ((acc.saldo / total) * 100).toFixed(1) : 0;

            const tipoLower = (acc.tipo || "default").toLowerCase();

            const accountTypeConfig = {
              corrente: { icon: "🏦", color: "#3b82f6" },
              poupanca: { icon: "🐷", color: "#f59e0b" },
              investimento: { icon: "📈", color: "#8b5cf6" },
              especie: { icon: "💵", color: "#10b981" },
              default: { icon: "💳", color: "#6366f1" },
            };

            const config = accountTypeConfig[tipoLower] || accountTypeConfig["default"];

            return {
              id: acc.id,
              label: acc.apelido || `${acc.banco} - ${acc.numero}`,
              percent: Number(percent),
              amount: Number(acc.saldo || 0),
              icon: config.icon,
              color: config.color,
            };
          })
          .filter(item => item.amount > 0);

        setDistributionData(distData);
              // =============================
      // 4. Buscar transações (paralelo)
      // =============================
      const transactionService = (await import("../../services/transactionService")).default;

      const transPromises = contas.map(c => transactionService.listByAccountId(c.id));
      const results = await Promise.all(transPromises);

      const todasTrans = results.flat();

      // =============================
      // 5. Totais de entradas/saídas
      // =============================

      // Normaliza nomes para evitar cadastro inconsistente
      const normalizeTipo = (tipo) => {
        if (!tipo) return "";
        return tipo.toLowerCase().replace("receita", "entrada").replace("despesa", "saida");
      };

      const totalReceitas = todasTrans
        .filter(t => normalizeTipo(t.tipo) === "entrada")
        .reduce((sum, t) => sum + Number(t.valor || 0), 0);

      const totalDespesas = todasTrans
        .filter(t => normalizeTipo(t.tipo) === "saida")
        .reduce((sum, t) => sum + Number(t.valor || 0), 0);

      setReceitas(totalReceitas);
      setDespesas(totalDespesas);

      // =============================
      // 6. Agrupar por categoria
      // =============================
      const receitasAgr = {};
      const despesasAgr = {};

      todasTrans.forEach(t => {
        const tipo = normalizeTipo(t.tipo);
        const cat = t.categoria || "Outros";
        const val = Number(t.valor || 0);

        if (tipo === "entrada") {
          if (!receitasAgr[cat]) receitasAgr[cat] = { name: cat, value: 0, color: "#10b981" };
          receitasAgr[cat].value += val;
        }

        if (tipo === "saida") {
          if (!despesasAgr[cat]) despesasAgr[cat] = { name: cat, value: 0, color: "#ef4444" };
          despesasAgr[cat].value += val;
        }
      });

      setReceitasData(Object.values(receitasAgr));
      setDespesasData(Object.values(despesasAgr));

    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    }
  }
        
      

        fetchData();

      
  }, []);
    
    const toggleDistribution = () => {
      setShowDistribution(!showDistribution);
    };
    
    const toggleReceitas = () => {
      setShowReceitas(!showReceitas);
    };
    
    const toggleDespesas = () => {
      setShowDespesas(!showDespesas);
    };


    const diferencaPercentual = receitas > 0 
    ? (((receitas - despesas) / receitas) * 100).toFixed(1)
    : 0;
    const isPositive = diferencaPercentual >= 0;

    // Define seta
    const arrow = isPositive ? "↗" : "↘";

    // Define cor
    const arrowColor = isPositive ? "#10b981" : "#ef4444"; // verde / vermelho
    const badgeBg = isPositive 
      ? (darkMode ? "rgba(16, 185, 129, 0.15)" : "#d1fae5")
      : (darkMode ? "rgba(239, 68, 68, 0.15)" : "#fee2e2");
      // Mapeia os tipos de conta para ícones e cores
    const accountTypeConfig = {
      'corrente': { icon: '🏦', color: '#3b82f6' },
      'poupanca': { icon: '🐷', color: '#f59e0b' },
      'investimento': { icon: '📈', color: '#8b5cf6' },
      'especie': { icon: '💵', color: '#10b981' },
      'default': { icon: '💳', color: '#6366f1' }
    };


    return (
      <HomeContainer>
        <PageTitle $darkMode={darkMode}>Visão Geral</PageTitle>
        <PageSubtitle $darkMode={darkMode}>Acompanhe suas finanças em tempo real</PageSubtitle>

        <ContentStack>
              <BalanceCard $darkMode={darkMode}>
                <BalanceHeader>
                  <BalanceLeftSection>
                    <BalanceIcon>💳</BalanceIcon>
                    <BalanceInfo>
                      <BalanceLabel $darkMode={darkMode}>Saldo Total</BalanceLabel>
                      <BalanceValue $darkMode={darkMode} onClick={toggleDistribution}>
                      R$ {totalBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </BalanceValue>
                      {showDistribution && (
                        <DistributionDropdown $darkMode={darkMode}>
                          <DistributionTitle $darkMode={darkMode}>Distribuição do Saldo</DistributionTitle>
                          {distributionData.length > 0 ? (
                            distributionData.map(item => (
                              <DistributionItem key={item.id} $darkMode={darkMode}>
                                <DistributionInfo>
                                  <DistributionIcon $color={item.color}>{item.icon}</DistributionIcon>
                                  <DistributionLabel $darkMode={darkMode}>{item.label}</DistributionLabel>
                                </DistributionInfo>
                                <DistributionValues>
                                  <DistributionPercent $darkMode={darkMode}>{item.percent}%</DistributionPercent>
                                  <DistributionAmount $darkMode={darkMode}>
                                    R$ {item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                  </DistributionAmount>
                                </DistributionValues>
                              </DistributionItem>
                            ))
                          ) : (
                            <DistributionLabel $darkMode={darkMode} style={{ textAlign: 'center', padding: '12px' }}>
                              Nenhuma conta com saldo disponível
                            </DistributionLabel>
                          )}
                        </DistributionDropdown>
                      )}
                    </BalanceInfo>
                  </BalanceLeftSection>
                  <GrowthBadge $darkMode={darkMode} style={{background:badgeBg,
                  color:arrowColor}}>
                    <span style={{ fontSize: '1.125rem' }}>{arrow}</span> {console.log(diferencaPercentual)} {Math.abs(diferencaPercentual)}%
                  </GrowthBadge>
                </BalanceHeader>
                <StatsRow $darkMode={darkMode}>
                  <StatItem 
                    $selected={showReceitas} 
                    $darkMode={darkMode}
                    $kind="receitas"
                    onClick={toggleReceitas}
                  >
                    <StatDot $color="#10b981" />
                    <StatInfo>
                      <StatLabel $darkMode={darkMode}>Receitas</StatLabel>
                      <StatValue color="#10b981">R$ {receitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</StatValue>
                    </StatInfo>
                  </StatItem>
                  <StatItem 
                    $selected={showDespesas}
                    $darkMode={darkMode}
                    $kind="despesas"
                    onClick={toggleDespesas}
                  >
                    <StatDot $color="#ef4444" />
                    <StatInfo>
                      <StatLabel $darkMode={darkMode}>Despesas</StatLabel>
                      <StatValue color="#ef4444">R$ {despesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</StatValue>
                    </StatInfo>
                  </StatItem>
                </StatsRow>
              </BalanceCard>

              {showReceitas && showDespesas && (
                <LineChart receitasData={receitasData} despesasData={despesasData} />
              )}

              {showReceitas && (
                <SourcesChart type="receitas" data={receitasData}/>
              )}

              {showDespesas && (
                <SourcesChart type="despesas" data={despesasData} />
              )}
        </ContentStack>
      </HomeContainer>
    );
  };

  export default Home;