import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import transactionService from '../../services/transactionService';
import accountService from '../../services/accountService';

const TransactionsContainer = styled.div`
  width: 100%;
  padding: 0;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${props => props.$darkMode ? '#f8fafc' : '#0f172a'};
  margin: 0;
  transition: color 0.3s ease;
`;

const Subtitle = styled.p`
  font-size: 0.95rem;
  color: ${props => props.$darkMode ? '#a78bfa' : '#64748b'};
  margin: 4px 0 0 0;
  transition: color 0.3s ease;
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 12px;
  background: ${props => props.$primary 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
    : props.$darkMode ? '#3b2167' : 'white'};
  color: ${props => props.$primary ? 'white' : props.$darkMode ? '#c4b5fd' : '#475569'};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid ${props => props.$darkMode ? '#4c1d95' : '#e2e8f0'};

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${props => props.$primary 
      ? 'rgba(102, 126, 234, 0.3)' 
      : 'rgba(0, 0, 0, 0.1)'};
  }
`;

// Modal
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
`;

const ModalCard = styled.div`
  width: 100%;
  max-width: 560px;
  background: ${props => props.$darkMode ? '#2d1b4e' : 'white'};
  border: 1px solid ${props => props.$darkMode ? '#4c1d95' : '#e2e8f0'};
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.2);
`;

const ModalTitle = styled.h3`
  margin: 0 0 16px 0;
  color: ${props => props.$darkMode ? '#f8fafc' : '#0f172a'};
`;

const FormRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
`;

const FormCol = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const Radio = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 10px;
  cursor: pointer;
  border: 1px solid ${props => props.$darkMode ? '#4c1d95' : '#e2e8f0'};
  background: ${props => props.$darkMode ? '#3b2167' : 'white'};
  color: ${props => props.$darkMode ? '#f8fafc' : '#0f172a'};
`;

const FilterSection = styled.div`
  background: ${props => props.$darkMode ? '#2d1b4e' : 'white'};
  border-radius: 16px;
  padding: 20px 24px;
  margin-bottom: 24px;
  border: 1px solid ${props => props.$darkMode ? '#4c1d95' : '#e2e8f0'};
  transition: all 0.3s ease;
`;

const FilterRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 200px;
`;

const FilterLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.$darkMode ? '#c4b5fd' : '#475569'};
  transition: color 0.3s ease;
`;

const Select = styled.select`
  padding: 10px 14px;
  border: 1px solid ${props => props.$darkMode ? '#4c1d95' : '#e2e8f0'};
  border-radius: 10px;
  background: ${props => props.$darkMode ? '#3b2167' : 'white'};
  color: ${props => props.$darkMode ? '#f8fafc' : '#0f172a'};
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.$darkMode ? '#6d28d9' : '#cbd5e1'};
  }

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const Input = styled.input`
  padding: 10px 14px;
  border: 1px solid ${props => props.$darkMode ? '#4c1d95' : '#e2e8f0'};
  border-radius: 10px;
  background: ${props => props.$darkMode ? '#3b2167' : 'white'};
  color: ${props => props.$darkMode ? '#f8fafc' : '#0f172a'};
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &::placeholder {
    color: ${props => props.$darkMode ? '#94a3b8' : '#94a3b8'};
  }

  &:hover {
    border-color: ${props => props.$darkMode ? '#6d28d9' : '#cbd5e1'};
  }

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const TransactionsList = styled.div`
  background: ${props => props.$darkMode ? '#2d1b4e' : 'white'};
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid ${props => props.$darkMode ? '#4c1d95' : '#e2e8f0'};
  transition: all 0.3s ease;
`;

const TransactionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid ${props => props.$darkMode ? '#4c1d95' : '#e2e8f0'};
  transition: all 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${props => props.$darkMode ? 'rgba(139, 92, 246, 0.05)' : '#f8fafc'};
  }
`;

const TransactionLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const TransactionIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

const TransactionInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TransactionTitle = styled.h4`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${props => props.$darkMode ? '#f8fafc' : '#0f172a'};
  margin: 0;
  transition: color 0.3s ease;
`;

const TransactionDetails = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const TransactionCategory = styled.span`
  font-size: 0.8rem;
  color: ${props => props.$darkMode ? '#a78bfa' : '#64748b'};
  transition: color 0.3s ease;
`;

const TransactionDate = styled.span`
  font-size: 0.8rem;
  color: ${props => props.$darkMode ? '#94a3b8' : '#94a3b8'};
  transition: color 0.3s ease;
`;

const TransactionRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
`;

const TransactionAmount = styled.span`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${props => props.$type === 'receita' ? '#10b981' : '#ef4444'};
`;

const TransactionAccount = styled.span`
  font-size: 0.8rem;
  color: ${props => props.$darkMode ? '#94a3b8' : '#64748b'};
  transition: color 0.3s ease;
`;

const EmptyState = styled.div`
  padding: 60px 24px;
  text-align: center;
  color: ${props => props.$darkMode ? '#94a3b8' : '#64748b'};
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 16px;
`;

const EmptyText = styled.p`
  font-size: 1rem;
  margin: 0;
`;

const Transactions = ({ darkMode }) => {
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ valor: '', tipo: 'receita', categoria: 'Salário', descricao: '' });
  const defaultReceita = ['Salário','Freelance','Venda','Rendimento'];
  const defaultDespesa = ['Alimentação','Contas','Transporte','Lazer','Saúde'];
  const [receitaOptions, setReceitaOptions] = useState(defaultReceita);
  const [despesaOptions, setDespesaOptions] = useState(defaultDespesa);

  // Dados mockados de transações
  /*
  const [transactions, setTransactions] = useState([
    {
      id: 'mock-1',
      title: 'Salário',
      category: 'Receita',
      date: '14/11/2025',
      amount: 4500.00,
      type: 'receita',
      account: 'Conta Corrente',
      icon: '💰',
      color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    },
    {
      id: 'mock-2',
      title: 'Compra Supermercado',
      category: 'Alimentação',
      date: '13/11/2025',
      amount: -345.50,
      type: 'despesa',
      account: 'Cartão de Crédito',
      icon: '🛒',
      color: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
    },
    {
      id: 'mock-3',
      title: 'Venda de Picolé',
      category: 'Receita',
      date: '12/11/2025',
      amount: 1200.00,
      type: 'receita',
      account: 'Dinheiro',
      icon: '🍦',
      color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    },
    {
      id: 'mock-4',
      title: 'Conta de Luz',
      category: 'Contas',
      date: '11/11/2025',
      amount: -150.00,
      type: 'despesa',
      account: 'Conta Corrente',
      icon: '💡',
      color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
    },
    {
      id: 'mock-5',
      title: 'Uber',
      category: 'Transporte',
      date: '10/11/2025',
      amount: -25.50,
      type: 'despesa',
      account: 'Cartão de Débito',
      icon: '🚗',
      color: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
    },
    {
      id: 'mock-6',
      title: 'Freelance Design',
      category: 'Receita',
      date: '09/11/2025',
      amount: 838.55,
      type: 'receita',
      account: 'Conta Corrente',
      icon: '💼',
      color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    },
    {
      id: 'mock-7',
      title: 'Cinema',
      category: 'Lazer',
      date: '08/11/2025',
      amount: -45.00,
      type: 'despesa',
      account: 'Dinheiro',
      icon: '🎬',
      color: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
    },
    {
      id: 'mock-8',
      title: 'Academia',
      category: 'Saúde',
      date: '05/11/2025',
      amount: -120.00,
      type: 'despesa',
      account: 'Cartão de Crédito',
      icon: '💪',
      color: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
    }
  ]);
*/
  const [transactions,setTransactions] = useState([]);
  const categoriaOptions = form.tipo === 'receita' ? receitaOptions : despesaOptions;

  // Carregar transações do backend ao montar o componente
  /*
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const backendTransactions = await transactionService.list();
        // Mapear transações do backend para o formato da UI
        const mappedTransactions = backendTransactions.map(t => ({
          id: t.id,
          title: t.origem || t.descricao || 'Sem título',
          category: t.origem || 'Outros',
          date: new Date(t.data).toLocaleDateString('pt-BR'),
          amount: t.tipo === 'despesa' ? -Math.abs(t.valor) : Math.abs(t.valor),
          type: t.tipo,
          account: 'Conta Corrente',
          icon: t.tipo === 'receita' ? '💰' : '🧾',
          color: t.tipo === 'receita' 
            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
            : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
        }));
        // Adicionar transações do backend no início da lista
        setTransactions(prev => [...mappedTransactions, ...prev]);
      } catch (error) {
        console.error('Erro ao carregar transações:', error);
      }
    };
    loadTransactions();
  }, []);
  */

  useEffect(() => {
  const loadAccountsAndTransactions = async () => {
    try {
      // 1. Carrega todas as contas
      const accounts = await accountService.list();

      let allTransactions = [];

      // 2. Para cada conta, carrega suas transações
      for (const acc of accounts) {
        try {
          const trans = await transactionService.listByAccountId(acc.id);

          const mapped = trans.map(t => ({
            id: t.id,
            title: t.titulo || 'Sem título',
            date: new Date(t.data).toLocaleDateString('pt-BR'),
            category:t.categoria,
            description:t.descricao,
            amount: t.tipo === 'despesa' ? -Math.abs(t.valor) : Math.abs(t.valor),
            type: t.tipo,
            third:t.origem || t.destino,
            banco: acc.banco,
            numBanco:acc.numero,
            icon: t.tipo === 'receita' ? '💰' : '🧾',
            color:
              t.tipo === 'receita'
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
          }));

          // Junta transações desta conta
          allTransactions = [...allTransactions, ...mapped];

        } catch (err) {
          console.warn(`Erro ao carregar transações da conta ${acc.id}`, err);
        }
      }

      // 3. Ordena por data (opcional)
      allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

      // 4. Atualiza estado global de transações
      setTransactions(allTransactions);

    } catch (error) {
      console.error("Erro ao carregar contas e transações:", error);
    }
  };

  loadAccountsAndTransactions();
}, []);

  const handleOpenModal = () => {
    setShowModal(true);
    setForm({ valor: '', tipo: 'receita', categoria: 'Salário', descricao: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let categoria = form.categoria;
    // Se "Nova Categoria" com descricao definida, adiciona à lista separada por tipo
    if (categoria === 'Nova Categoria' && form.descricao.trim()) {
      const novaCategoria = form.descricao;
      if (form.tipo === 'receita' && !receitaOptions.includes(novaCategoria)) {
        setReceitaOptions(prev => [...prev, novaCategoria]);
        categoria = novaCategoria;
      } else if (form.tipo === 'despesa' && !despesaOptions.includes(novaCategoria)) {
        setDespesaOptions(prev => [...prev, novaCategoria]);
        categoria = novaCategoria;
      } else {
        // Se já existe, usa a categoria
        categoria = novaCategoria;
      }
    }

    // Persistência no backend
    try {
      const payload = {
        tipo: form.tipo,
        valor: Number(form.valor),
        categoria,
        descricao: form.descricao,
        data: new Date().toISOString(), // Adiciona data atual em formato ISO
      };
      const created = await transactionService.create(payload);

      // Atualiza lista local rapidamente
      const newItem = {
        id: created.id || Date.now(),
        title: categoria,
        category: categoria,
        date: new Date().toLocaleDateString('pt-BR'),
        amount: form.tipo === 'despesa' ? -Math.abs(Number(form.valor)) : Math.abs(Number(form.valor)),
        type: form.tipo,
        account: 'Conta Corrente',
        icon: form.tipo === 'receita' ? '💰' : '🧾',
        color: form.tipo === 'receita' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      };
      setTransactions(prev => [newItem, ...prev]);
      setShowModal(false);
    } catch (err) {
      console.error('Erro ao criar transação', err);
      // Mesmo em caso de erro, poderíamos manter local opcionalmente
    }
  };

  // Filtrar transações
  const filteredTransactions = transactions.filter(transaction => {
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory;
    const matchesSearch = transaction.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesCategory && matchesSearch;
  });

  return (
    <TransactionsContainer>
      <Header>
        <div>
          <Title $darkMode={darkMode}>Transações</Title>
          <Subtitle $darkMode={darkMode}>Gerencie todas as suas movimentações financeiras</Subtitle>
        </div>
        <Actions>
          <Button $darkMode={darkMode}>
            📥 Importar
          </Button>
          <Button $primary $darkMode={darkMode} onClick={handleOpenModal}>
            ➕ Nova Transação
          </Button>
        </Actions>
      </Header>

      <FilterSection $darkMode={darkMode}>
        <FilterRow>
          <FilterGroup>
            <FilterLabel $darkMode={darkMode}>Tipo</FilterLabel>
            <Select 
              $darkMode={darkMode}
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">Todos</option>
              <option value="receita">Receitas</option>
              <option value="despesa">Despesas</option>
            </Select>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel $darkMode={darkMode}>Categoria</FilterLabel>
            <Select 
              $darkMode={darkMode}
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">Todas</option>
              <option value="Receita">Receita</option>
              <option value="Alimentação">Alimentação</option>
              <option value="Contas">Contas</option>
              <option value="Transporte">Transporte</option>
              <option value="Lazer">Lazer</option>
              <option value="Saúde">Saúde</option>
            </Select>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel $darkMode={darkMode}>Buscar</FilterLabel>
            <Input 
              $darkMode={darkMode}
              type="text"
              placeholder="Procurar transação..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </FilterGroup>
        </FilterRow>
      </FilterSection>

      <TransactionsList $darkMode={darkMode}>
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map(transaction => (
            <TransactionItem key={transaction.id} $darkMode={darkMode}>
              {console.log(transaction)}
              <TransactionLeft>
                <TransactionIcon $color={transaction.color}>
                  {transaction.icon}
                </TransactionIcon>
                <TransactionInfo>
                  <TransactionTitle $darkMode={darkMode}>
                    {transaction.title}
                  </TransactionTitle>
                  <TransactionDetails>
                    <TransactionCategory $darkMode={darkMode}>
                     {transaction.description} 
                    </TransactionCategory>
                    <span style={{ color: darkMode ? '#4c1d95' : '#cbd5e1' }}>•</span>
                    <TransactionCategory $darkMode={darkMode}>
                     {transaction.category} 
                    </TransactionCategory>
                    <span style={{ color: darkMode ? '#4c1d95' : '#cbd5e1' }}>•</span>
                     <TransactionCategory $darkMode={darkMode}>
                     {transaction.third} 
                    </TransactionCategory>
                    <span style={{ color: darkMode ? '#4c1d95' : '#cbd5e1' }}>•</span>
                    <TransactionDate $darkMode={darkMode}>
                      {transaction.date}
                    </TransactionDate>
                  </TransactionDetails>
                </TransactionInfo>
              </TransactionLeft>
              <TransactionRight>
                <TransactionAmount $type={transaction.type}>
                  {transaction.type === 'receita' ? '+' : '-'} R$ {Math.abs(transaction.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </TransactionAmount>
                <TransactionAccount $darkMode={darkMode}>
                  {transaction.banco} <span style={{ color: darkMode ? '#4c1d95' : '#cbd5e1' }}>•</span> {transaction.numBanco}
               
                </TransactionAccount>
              </TransactionRight>
            </TransactionItem>
          ))
        ) : (
          <EmptyState $darkMode={darkMode}>
            <EmptyIcon>🔍</EmptyIcon>
            <EmptyText>Nenhuma transação encontrada</EmptyText>
          </EmptyState>
        )}
      </TransactionsList>

      {showModal && (
        <ModalOverlay>
          <ModalCard $darkMode={darkMode}>
            <ModalTitle $darkMode={darkMode}>Nova Transação</ModalTitle>
            <form onSubmit={handleSubmit}>
              <FormRow>
                <FormCol>
                  <FilterLabel $darkMode={darkMode}>Tipo</FilterLabel>
                  <RadioGroup>
                    <Radio $darkMode={darkMode}>
                      <input
                        type="radio"
                        name="tipo"
                        value="receita"
                        checked={form.tipo === 'receita'}
                        onChange={(e) => setForm({ ...form, tipo: e.target.value, categoria: 'Salário' })}
                      />
                      Receita
                    </Radio>
                    <Radio $darkMode={darkMode}>
                      <input
                        type="radio"
                        name="tipo"
                        value="despesa"
                        checked={form.tipo === 'despesa'}
                        onChange={(e) => setForm({ ...form, tipo: e.target.value, categoria: 'Alimentação' })}
                      />
                      Despesa
                    </Radio>
                  </RadioGroup>
                </FormCol>
                <FormCol>
                  <FilterLabel $darkMode={darkMode}>Valor</FilterLabel>
                  <Input
                    $darkMode={darkMode}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    value={form.valor}
                    onChange={(e) => setForm({ ...form, valor: e.target.value })}
                    required
                  />
                </FormCol>
              </FormRow>

              <FormRow>
                <FormCol>
                  <FilterLabel $darkMode={darkMode}>Categoria</FilterLabel>
                  <Select
                    $darkMode={darkMode}
                    value={form.categoria}
                    onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                  >
                    {categoriaOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                    <option value="Nova Categoria">Nova Categoria</option>
                  </Select>
                </FormCol>
                <FormCol>
                  <FilterLabel $darkMode={darkMode}>Descrição (opcional ou "Nova Categoria")</FilterLabel>
                  <Input
                    $darkMode={darkMode}
                    type="text"
                    placeholder={form.categoria === 'Nova Categoria' ? 'Digite a nova categoria' : 'Ex: detalhamento da transação'}
                    value={form.descricao}
                    onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                  />
                </FormCol>
              </FormRow>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
                <Button type="button" onClick={() => setShowModal(false)} $darkMode={darkMode}>Cancelar</Button>
                <Button type="submit" $primary $darkMode={darkMode}>Salvar</Button>
              </div>
            </form>
          </ModalCard>
        </ModalOverlay>
      )}
    </TransactionsContainer>
  );
};

export default Transactions;
