import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import accountService from '../../services/accountService';

const AccountsContainer = styled.div`
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

const AccountList = styled.div`
  background: ${props => props.$darkMode ? '#2d1b4e' : 'white'};
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid ${props => props.$darkMode ? '#4c1d95' : '#e2e8f0'};
  transition: all 0.3s ease;
`;

const AccountItem = styled.div`
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
    cursor: pointer;
  }
`;

const AccountLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const AccountIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

const AccountInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const AccountTitle = styled.h4`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${props => props.$darkMode ? '#f8fafc' : '#0f172a'};
  margin: 0;
  transition: color 0.3s ease;
`;

const AccountDetails = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const AccountCategory = styled.span`
  font-size: 0.8rem;
  color: ${props => props.$darkMode ? '#a78bfa' : '#64748b'};
  transition: color 0.3s ease;
`;


const AccountRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
`;

const AccountAmount = styled.span`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${props => props.$type === 'receita' ? '#10b981' : '#ef4444'};
`;

const AccountBank = styled.span`
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


const Contas = ({ darkMode }) => {
  const [accounts, setAccounts] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const defaultReceita = ['Salário','Freelance','Venda','Rendimento'];
  const defaultDespesa = ['Alimentação','Contas','Transporte','Lazer','Saúde'];
  const [receitaOptions, setReceitaOptions] = useState(defaultReceita);
  const [despesaOptions, setDespesaOptions] = useState(defaultDespesa);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ valor: '', tipo: 'receita', categoria: 'Salário', descricao: '' });
  const [user,setUser] = useState(()=>{
    const stored = localStorage.getItem("user");
    return stored? JSON.parse(stored):"Usuário";
  })
  const categoriaOptions = form.tipo === 'receita' ? receitaOptions : despesaOptions;
  const handleOpenModal = () => {
    setShowModal(true);
    fetchAccount();
  };
  // GET na conta por ID
  const[selectedAccount,setSelectedAccount] = useState(null);
  useEffect(() => {
  async function fetchAccount() {
    if(!showModal) return;
    try {
      const id = 4; // exemplo — pode vir de props, rota, seleção etc.
      const response = await accountService.getById(id);
      setSelectedAccount(response);
    } catch (err) {
      console.error("Erro ao buscar conta", err);
    }
  }
  //IMPLEMENTAR GET CONTA BY ID NO CONTROLLER.
    fetchAccount();
  }, [showModal]);


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
  // Carregar contas do backend
  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const backendAccounts = await accountService.list();

        const mapped = backendAccounts.map(acc => ({
          id: acc.id,
          title: acc.apelido || 'Conta',
          category: acc.tipo || 'Conta',
          num: acc.numero || 'Numero',
          agency: acc.agencia || 'Agência',
          amount: acc.saldo || 0,
          type: 'conta',
          account: acc.banco || 'Banco',
          icon: '🏦',
          color: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
        }));

        setAccounts(mapped);
      } catch (err) {
        console.error('Erro ao carregar contas:', err);
      }
    };

    loadAccounts();
  }, []);

  // Filtragem (baseado em “accounts” em vez de transactions)
  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch; // pode ajustar filtros depois
  });


  return (
    <AccountsContainer>
      <Header>
          <div>
          <Title $darkMode={darkMode}>Contas</Title>
          <Subtitle $darkMode={darkMode}>Aqui estão suas contas e seus balanços, {user?.nome} </Subtitle>
        </div>
        <Actions>
          <Button $darkMode={darkMode}>
            🔄 Atualizar
          </Button>
        </Actions>
        
      </Header>
   
   <AccountList $darkMode={darkMode}>
  {filteredAccounts.length > 0 ? (
    filteredAccounts.map(account => (
      <AccountItem key={account.id} $darkMode={darkMode} onClick={handleOpenModal}>
        <AccountLeft>
          <AccountIcon $color={account.color}>
            {account.icon}
          </AccountIcon>
          <AccountInfo>
            <AccountTitle $darkMode={darkMode}>
              {account.title}
            </AccountTitle>
            <AccountDetails>
              <AccountCategory $darkMode={darkMode}>
                {account.category}
              </AccountCategory>
              <span style={{ color: darkMode ? '#4c1d95' : '#cbd5e1' }}>•</span>  
              <AccountCategory $darkMode={darkMode}>
                 {account.num}
              </AccountCategory>
            </AccountDetails>
          </AccountInfo>
        </AccountLeft>
        <AccountRight>
          <AccountAmount $type="conta">
            R$ {Math.abs(account.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </AccountAmount>
          <AccountBank $darkMode={darkMode}>
            {account.account}
          </AccountBank>
        </AccountRight>
      </AccountItem>
    ))
    
  ) 
  : (
    <EmptyState $darkMode={darkMode}>
      <EmptyIcon>🔍</EmptyIcon>
      <EmptyText>Nenhuma conta encontrada</EmptyText>
    </EmptyState>
  )}
</AccountList>
  {showModal && (
        <ModalOverlay>
          <ModalCard $darkMode={darkMode}>
            <ModalTitle $darkMode={darkMode}>Detalhes da Conta</ModalTitle>
            <form onSubmit={handleSubmit}>
              <FormRow>
                <FormCol>
                  <FilterLabel $darkMode={darkMode}>Tipo</FilterLabel>
                  <AccountDetails>
                    
                  </AccountDetails>
                </FormCol>
                <FormCol>
                  <FilterLabel $darkMode={darkMode}>Apelido</FilterLabel>
                  <Input
                    $darkMode={darkMode}
                    type="text"
                    step="0.01"
                    min="0"
                    placeholder=""
                    value={form.valor}
                    onChange={(e) => setForm({ ...form, valor: e.target.value })}
                    required
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
    
 </AccountsContainer>



  );
};

export default Contas;
