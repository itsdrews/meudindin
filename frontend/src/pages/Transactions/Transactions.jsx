// ...existing code...
const initialFormState = {
  valor: '',
  tipo: 'receita',
  categoria: 'Salário',
  descricao: '',
  contaId: '',
  data: '',
};

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Button from '../../components/ui/Button';
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
  max-width: 640px;
  max-height: 90vh;
  overflow-y: auto;
  background: ${props => props.$darkMode ? '#2d1b4e' : 'white'};
  border: 1px solid ${props => props.$darkMode ? '#4c1d95' : '#e2e8f0'};
  border-radius: 16px;
  padding: 28px;
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
  console.log("[INIT] Componente Transactions montado");

  const initialFormState = {
    valor: '',
    tipo: 'receita',
    categoria: 'Salário',
    descricao: '',
    contaId: '',
    data: '',
  };

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialFormState);
  const [editId, setEditId] = useState(null);

  console.log("[STATE] Estado inicial:", {
    showModal,
    form,
    editId
  });

  // Abrir modal para adicionar
  const handleOpenModal = () => {
    console.log("======== [OPEN_MODAL] ========");
    console.log("[OPEN_MODAL] Accounts =", accounts);

    const primeiraContaId = accounts.length > 0 ? accounts[0].id : '';

    console.log("[OPEN_MODAL] primeiraContaId =", primeiraContaId);

    setShowModal(true);
    setEditId(null);

    const novoForm = { ...initialFormState, contaId: primeiraContaId };

    console.log("[OPEN_MODAL] Form após reset =", novoForm);

    setForm(novoForm);
  };

  // Abrir modal para editar
  const handleEditTransaction = (transaction) => {
    console.log("======== [EDIT_MODAL] ========");
    console.log("[EDIT_MODAL] Transação recebida =", transaction);
    console.log("[EDIT_MODAL] Accounts disponíveis =", accounts);

    const contaEncontrada = accounts.find(
      acc => acc.banco === transaction.banco && acc.numero === transaction.numBanco
    );

    console.log("[EDIT_MODAL] Conta encontrada =", contaEncontrada);

    const dataConvertida = transaction.date.split('/').reverse().join('-');
    console.log("[EDIT_MODAL] Data convertida PT-BR → ISO =", dataConvertida);

    const novoForm = {
      valor: Math.abs(transaction.amount).toString(),
      tipo: transaction.type,
      categoria: transaction.category,
      descricao: transaction.description || '',
      contaId: contaEncontrada?.id || '',
      data: dataConvertida,
    };

    console.log("[EDIT_MODAL] Novo form =", novoForm);

    setShowModal(true);
    setEditId(transaction.id);
    setForm(novoForm);
  };

  // Submeter formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("======== [SUBMIT] Início ========");
    console.log("[SUBMIT] form =", form);
    console.log("[SUBMIT] editId =", editId);

    let categoria = form.categoria;

    // Categoria é nova?
    if (categoria === 'Nova Categoria' && form.descricao.trim()) {
      const novaCategoria = form.descricao;
      console.log("[SUBMIT] Nova categoria detectada:", novaCategoria);

      if (form.tipo === 'receita' && !receitaOptions.includes(novaCategoria)) {
        console.log("[SUBMIT] Adicionando nova receita");
        setReceitaOptions(prev => [...prev, novaCategoria]);
      } else if (form.tipo === 'despesa' && !despesaOptions.includes(novaCategoria)) {
        console.log("[SUBMIT] Adicionando nova despesa");
        setDespesaOptions(prev => [...prev, novaCategoria]);
      }

      categoria = novaCategoria;
    }

    // MONTAR PAYLOAD
    const payload = editId
      ? { identificador: categoria }
      : {
          tipo: form.tipo === 'receita' ? 'entrada' : 'saida',
          valor: Number(form.valor),
          categoria,
          descricao: form.descricao,
          titulo: categoria,
          data: form.data
            ? new Date(form.data).toISOString()
            : new Date().toISOString(),
        };

    console.log("[SUBMIT] Payload final =", payload);

    // Validar conta
    const contaObj = accounts.find(acc => String(acc.id) === String(form.contaId));

    console.log("[SUBMIT] Conta encontrada para esse ID =", contaObj);

    const idConta = contaObj ? contaObj.id : accounts[0]?.id;

    console.log("[SUBMIT] ID da conta usada =", idConta);

    if (!idConta) {
      console.error("[SUBMIT] ERRO: Nenhuma conta válida encontrada.");
      return;
    }

    try {
      console.log("[SUBMIT] Chamando service...");

      if (editId) {
        console.log("[SUBMIT] UPDATE → update(", editId, idConta, payload, ")");
        await transactionService.update(editId, idConta, payload);
      } else {
        console.log("[SUBMIT] CREATE → create(", idConta, payload, ")");
        await transactionService.create(idConta, payload);
      }

      console.log("[SUBMIT] Sucesso! Resetando estados.");

      setShowModal(false);
      setEditId(null);
      setForm(initialFormState);

      console.log("[SUBMIT] Recarregando contas + transações...");
      await loadAccountsAndTransactions();

      console.log("[SUBMIT] Finalizado sem erros!");

    } catch (err) {
      console.error("[SUBMIT] ERRO AO SALVAR:", err);
      alert('Erro ao salvar transação — veja o console.');
    }
  };

  // ================================
  // FILTROS / OPÇÕES
  // ================================
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAccount, setFilterAccount] = useState('all');

  const defaultReceita = ['Salário','Freelance','Venda','Rendimento'];
  const defaultDespesa = ['Alimentação','Contas','Transporte','Lazer','Saúde'];

  const [receitaOptions, setReceitaOptions] = useState(defaultReceita);
  const [despesaOptions, setDespesaOptions] = useState(defaultDespesa);

  const [transactions,setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);

  const categoriaOptions = form.tipo === 'receita' ? receitaOptions : despesaOptions;

  // ================================
  // CARREGAR CONTAS + TRANSAÇÕES
  // ================================
  const loadAccountsAndTransactions = async () => {
    console.log("======== [LOAD] Carregando contas + transações ========");

    try {
      const accounts = await accountService.list();
      console.log("[LOAD] Contas carregadas =", accounts);

      setAccounts(accounts);
      let allTransactions = [];

      for (const acc of accounts) {
        console.log(`[LOAD] Buscando transações da conta ${acc.id}`);

        try {
          const trans = await transactionService.listByAccountId(acc.id);

          console.log(`[LOAD] Transações recebidas da conta ${acc.id}:`, trans);

          const mapped = trans.map(t => ({
            id: t.id,
            title: t.titulo || 'Sem título',
            date: new Date(t.data).toLocaleDateString('pt-BR'),
            category: t.categoria,
            description: t.descricao,
            amount: t.tipo === 'saida' ? -Math.abs(t.valor) : Math.abs(t.valor),
            type: t.tipo === 'entrada' ? 'receita' : 'despesa',
            third: t.origem || t.destino,
            banco: acc.banco,
            numBanco: acc.numero,
            accountId: acc.id,
            icon: t.tipo === 'entrada' ? '💰' : '🧾',
            color:
              t.tipo === 'entrada'
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
          }));

          console.log(`[LOAD] Transações mapeadas da conta ${acc.id}:`, mapped);

          allTransactions = [...allTransactions, ...mapped];

        } catch (err) {
          console.warn(`[LOAD] ERRO ao carregar transações da conta ${acc.id}:`, err);
        }
      }

      console.log("[LOAD] TOTAL de transações = ", allTransactions.length);

      allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

      console.log("[LOAD] Transações ordenadas por data.");

      setTransactions(allTransactions);

      console.log("[LOAD] Load finalizado!");

    } catch (error) {
      console.error("ERRO AO CARREGAR CONTAS E TRANSAÇÕES:", error);
    }
  };

  useEffect(() => {
    loadAccountsAndTransactions();
  }, []);

  // ================================
  // FILTRAGEM COM LOG
  // ================================
  const filteredTransactions = transactions.filter(transaction => {
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory;
    const matchesSearch = transaction.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAccount = filterAccount === 'all' || String(transaction.accountId) === String(filterAccount);

    return matchesType && matchesCategory && matchesSearch && matchesAccount;
  });

  console.log("[FILTER] Transações filtradas =", filteredTransactions);

  return (
    <TransactionsContainer>
      {/* Barra de filtros com botão adicionar */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Filtro de tipo */}
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            style={{ padding: '8px', borderRadius: 8 }}
          >
            <option value="all">Todos</option>
            <option value="receita">Receita</option>
            <option value="despesa">Despesa</option>
          </select>
          {/* Filtro de categoria */}
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            style={{ padding: '8px', borderRadius: 8 }}
          >
            <option value="all">Todas as categorias</option>
            {receitaOptions.concat(despesaOptions).map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          {/* Filtro de conta */}
          <select
            value={filterAccount}
            onChange={e => setFilterAccount(e.target.value)}
            style={{ padding: '8px', borderRadius: 8 }}
          >
            <option value="all">Todas as contas</option>
            {accounts.map(acc => (
              <option key={acc.id} value={acc.id}>
                {acc.apelido} — {acc.banco} ({acc.numero})
              </option>
            ))}
          </select>
        </div>
        <Button $primary $darkMode={darkMode} onClick={handleOpenModal}>
          ➕ Adicionar Transação
        </Button>
      </div>

      <TransactionsList $darkMode={darkMode}>
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map(transaction => (
            <TransactionItem key={transaction.id} $darkMode={darkMode} onClick={() => handleEditTransaction(transaction)} style={{ cursor: 'pointer' }}>
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

      {/* Modal de adicionar/editar transação */}
      {showModal && (
        <ModalOverlay>
          <ModalCard $darkMode={darkMode}>
            <ModalTitle $darkMode={darkMode}>{editId ? 'Editar Categoria da Transação' : 'Adicionar Transação'}</ModalTitle>
            <form onSubmit={handleSubmit}>
              {editId ? (
                <FormRow>
                  <FormCol>
                    <FilterLabel $darkMode={darkMode}>Categoria</FilterLabel>
                    <Select
                      $darkMode={darkMode}
                      value={form.categoria}
                      onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                      required
                    >
                      {categoriaOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                      <option value="Nova Categoria">Nova Categoria</option>
                    </Select>
                  </FormCol>
                </FormRow>
              ) : (
                <>
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
                      <FilterLabel $darkMode={darkMode}>Conta</FilterLabel>
                      <Select
                        $darkMode={darkMode}
                        value={form.contaId}
                        onChange={(e) => setForm({ ...form, contaId: e.target.value })}
                        required
                        readOnly={!!editId}
                        disabled={!!editId}
                      >
                        {accounts.length === 0 && <option value="">Carregando contas...</option>}
                        {accounts.map(acc => (
                          <option key={acc.id} value={acc.id}>
                            {acc.apelido || acc.banco} - {acc.numero} (R$ {Number(acc.saldo || 0).toFixed(2)})
                          </option>
                        ))}
                      </Select>
                    </FormCol>
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
                  </FormRow>

                  <FormRow>
                    <FormCol>
                      <FilterLabel $darkMode={darkMode}>Descrição</FilterLabel>
                      <Input
                        $darkMode={darkMode}
                        type="text"
                        placeholder="Ex: detalhamento da transação"
                        value={form.descricao}
                        onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                      />
                    </FormCol>
                    <FormCol>
                      <FilterLabel $darkMode={darkMode}>Data</FilterLabel>
                      <Input
                        $darkMode={darkMode}
                        type="date"
                        value={form.data}
                        onChange={(e) => setForm({ ...form, data: e.target.value })}
                        required
                      />
                    </FormCol>
                  </FormRow>
                </>
              )}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
                <Button type="button" onClick={() => { setShowModal(false); setEditId(null); setForm(initialFormState); }} $darkMode={darkMode}>Cancelar</Button>
                <Button type="submit" $primary $darkMode={darkMode}>{editId ? 'Salvar Edição' : 'Adicionar'}</Button>
              </div>
            </form>
          </ModalCard>
        </ModalOverlay>
      )}
    </TransactionsContainer>
  );
};

export default Transactions;
