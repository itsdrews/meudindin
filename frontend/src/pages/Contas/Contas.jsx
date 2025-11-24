import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import accountService from '../../services/accountService';

// ========== ESTILOS ==========
const AccountsContainer = styled.div`
  width: 100%;
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
  color: ${p => p.$darkMode ? '#f8fafc' : '#0f172a'};
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 0.95rem;
  color: ${p => p.$darkMode ? '#a78bfa' : '#64748b'};
  margin: 4px 0 0 0;
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
  background: ${p => p.$primary 
    ? 'linear-gradient(135deg, #667eea, #764ba2)' 
    : p.$darkMode ? '#3b2167' : 'white'};
  color: ${p => p.$primary ? 'white' : p.$darkMode ? '#c4b5fd' : '#475569'};
  cursor: pointer;
  border: 1px solid ${p => p.$darkMode ? '#4c1d95' : '#e2e8f0'};

  &:hover {
    transform: translateY(-1px);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalCard = styled.div`
  background: ${p => p.$darkMode ? '#2d1b4e' : 'white'};
  border: 1px solid ${p => p.$darkMode ? '#4c1d95' : '#e2e8f0'};
  width: 500px;
  padding: 24px;
  border-radius: 16px;
`;

const ModalTitle = styled.h3`
  margin: 0 0 16px;
  color: ${p => p.$darkMode ? 'white' : '#0f172a'};
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 12px;
  border-radius: 10px;
  background: ${p => p.$darkMode ? '#3b2167' : 'white'};
  color: ${p => p.$darkMode ? 'white' : '#0f172a'};
  border: 1px solid ${p => p.$darkMode ? '#4c1d95' : '#cbd5e1'};

   /* Bloqueia seleção e clique quando readOnly */
  ${p => p.readOnly && `
    pointer-events: none;
    user-select: none;
    opacity: 0.75;
    cursor: default;
  `}

  &:focus {
    outline: none;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  margin-bottom: 12px;
  margin-bottom: 12px;
  border-radius: 10px;
  background: ${p => p.$darkMode ? '#3b2167' : 'white'};
  color: ${p => p.$darkMode ? 'white' : '#0f172a'};
  border: 1px solid ${p => p.$darkMode ? '#4c1d95' : '#cbd5e1'};
`;

const AccountList = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;

const AccountCard = styled.div`
  flex: 1;
  min-width: 340px;
  background:${p => p.$darkMode ? '#2d1b4e' : 'white'};
  border-radius: 16px;
  padding: 20px;
  color: ${p => p.$darkMode ? 'white' : '#0f172a'};
  border: 1px solid ${p => p.$darkMode ? '#4c1d95' : '#e2e8f0'};
  
  &:hover{
    cursor: pointer;
    transform: scale(1.02);
  }
`;

// ========== COMPONENTE ==========
const Contas = ({ darkMode }) => {
  const [accounts, setAccounts] = useState([]);
  const [accountsWithSaldo, setAccountsWithSaldo] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [apelido, setApelido] = useState("");

  

  const [form, setForm] = useState({
    apelido: "",
    tipo: "corrente",
    banco: "",
    agencia: "",
    numero: "",
    codBanco: ""
  });

  // Carrega contas do backend
  useEffect(() => {
    async function load() {
      const data = await accountService.list();
      setAccounts(data);
      // Calcula saldo de cada conta com base nas transações
      const transactionService = (await import('../../services/transactionService')).default;
      const contasComSaldo = [];
      for (const acc of data) {
        const trans = await transactionService.listByAccountId(acc.id);
        const receitasConta = trans.filter(t => t.tipo === 'entrada').reduce((sum, t) => sum + Number(t.valor || 0), 0);
        const despesasConta = trans.filter(t => t.tipo === 'saida').reduce((sum, t) => sum + Number(t.valor || 0), 0);
        contasComSaldo.push({
          ...acc,
          saldoCalculado: receitasConta - despesasConta
        });
      }
      setAccountsWithSaldo(contasComSaldo);
    }
    load();
  }, []);

    // Carrega dados da conta ao abrir modal
  useEffect(() => {
    if (!selectedAccountId) return;

    async function fetchAccount() {
      try {
        const data = await accountService.getById(selectedAccountId);
        setSelectedAccount(data);
        setApelido(data.apelido);
      } catch (err) {
        console.error("Erro ao buscar conta:", err);
      }
    }

    fetchAccount();
  }, [selectedAccountId]);

  // Salvar apenas o apelido
  async function handleSaveApelido() {
    try {
      await accountService.update(selectedAccountId, { apelido });

      // Atualiza lista principal
      setAccounts(prev =>
        prev.map(acc =>
          acc.id === selectedAccountId ? { ...acc, apelido } : acc
        )
      );

      setIsEditing(false);
    } catch (err) {
      alert("Erro ao atualizar apelido");
      console.log(err);
    }
  }

  const openViewModal = (id) => {
    setSelectedAccountId(id);
    setShowModal(true);
    setIsEditing(false);
  };



  // Salvar Nova Conta
  const handleCreate = async (e) => {
    e.preventDefault();

    // Gera saldo aleatório entre 1000 e 10000
    const saldoRandomizado = Math.floor(Math.random() * 9000) + 1000;
    
    const payload = {
      numero: form.numero,
      agencia: form.agencia ? Number(form.agencia) : 0,
      codBanco: form.codBanco ? Number(form.codBanco) : 0,
      tipo: form.tipo,
      banco: form.banco,
      saldo: saldoRandomizado,
      apelido: form.apelido || `${form.banco} - ${form.tipo}`,
    };

    console.log("Payload enviado:", payload);

    try {
      const response = await accountService.create(payload);
      const novaConta = response.conta; 

      setAccounts(prev => [
        ...prev,
        {
          id: novaConta.id,
          apelido: novaConta.apelido || "Conta",
          tipo: novaConta.tipo,
          banco: novaConta.banco,
          numero: novaConta.numero,
          agencia: novaConta.agencia,
          saldo: novaConta.saldo,
          type: "conta",
          icon: "🏦",
          color: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
        }
      ]);

      // Reseta o formulário e fecha o modal
      setForm({
        apelido: "",
        tipo: "corrente",
        banco: "",
        agencia: "",
        numero: "",
        codBanco: ""
      });
      setShowCreateModal(false);
    } catch (err) {
      console.error("Erro ao criar conta:", err.response?.data || err.message);
      alert(err.response?.data?.erro || "Erro ao criar conta");
    }
  };


  return (
    <AccountsContainer>
      <Header>
        <div>
          <Title $darkMode={darkMode}>Contas</Title>
          <Subtitle $darkMode={darkMode}>Gerencie suas contas bancárias</Subtitle>
        </div>

        <Actions>
          <Button 
            onClick={() => setShowCreateModal(true)}
            $primary
          >
            + Nova Conta
          </Button>
          <Button 
            onClick={() =>{setTimeout(()=>{
              window.location.reload()
            },500)}}
          >
            ↻ Atualizar
          </Button>
        </Actions>
      </Header>

      {/* LISTA */}
      <AccountList>
        {accountsWithSaldo.length >0? accountsWithSaldo.map(acc => (
          <AccountCard key={acc.id} $darkMode={darkMode} onClick={() =>openViewModal(acc.id)}>
            <h3 style={{ margin: 0 }}>{acc.apelido}</h3>
            <p>{acc.tipo} • {acc.banco}</p>
            <strong>R$ {acc.saldoCalculado?.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</strong>
          </AccountCard>
        )):(
  <p style={{ opacity: 0.7, fontStyle: "italic", marginTop: "1rem" }}>
    Nenhuma conta sincronizada ainda.
  </p>
)}
      </AccountList>

     {/* MODAL DE CRIAÇÃO */}
      {showCreateModal && (
        <ModalOverlay>
          <ModalCard $darkMode={darkMode}>
            <ModalTitle $darkMode={darkMode}>Nova Conta</ModalTitle>
            <form onSubmit={handleCreate}>
              <Input 
                $darkMode={darkMode}
                placeholder="Nome da conta (apelido)"
                value={form.apelido}
                onChange={e => setForm({ ...form, apelido: e.target.value })}
              />

              <Input 
                $darkMode={darkMode}
                placeholder="Nome do Banco"
                value={form.banco}
                onChange={e => setForm({ ...form, banco: e.target.value })}
                required
              />

              <Input 
                $darkMode={darkMode}
                placeholder="Código do Banco (ex: 001)"
                type="number"
                value={form.codBanco}
                onChange={e => setForm({ ...form, codBanco: e.target.value })}
                required
              />

              <Input 
                $darkMode={darkMode}
                placeholder="Agência"
                type="number"
                value={form.agencia}
                onChange={e => setForm({ ...form, agencia: e.target.value })}
                required
              />

              <Input 
                $darkMode={darkMode}
                placeholder="Número da Conta"
                value={form.numero}
                onChange={e => setForm({ ...form, numero: e.target.value })}
                required
              />

              <Select
                $darkMode={darkMode}
                value={form.tipo}
                onChange={e => setForm({ ...form, tipo: e.target.value })}
                required
              >
                <option value="corrente">Conta Corrente</option>
                <option value="poupanca">Conta Poupança</option>
              </Select>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 16 }}>
                <Button type="button" onClick={() => setShowCreateModal(false)} $darkMode={darkMode}>Cancelar</Button>
                <Button type="submit" $primary>Criar Conta</Button>
              </div>
            </form>
          </ModalCard>
        </ModalOverlay>
      )}

     {/* MODAL DE VISUALIZAÇÃO */}
      {showModal && selectedAccount && (
        <ModalOverlay>
          <ModalCard $darkMode={darkMode}>
            <ModalTitle $darkMode={darkMode}>
              Conta • {selectedAccount.apelido}
            </ModalTitle>

            {/* CAMPOS SOMENTE LEITURA */}
            <Input 
              readOnly 
              value={selectedAccount.banco}
              $darkMode={darkMode}
            />

            <Input 
              readOnly 
              value={`Agência: ${selectedAccount.agencia}`}
              $darkMode={darkMode}
            />

            <Input 
              readOnly 
              value={`Número: ${selectedAccount.numero}`}
              $darkMode={darkMode}
            />

            <Input 
              readOnly 
              value={`Tipo: ${selectedAccount.tipo}`}
              $darkMode={darkMode}
            />

            <Input 
              readOnly 
              value={`Saldo: R$ ${selectedAccount.saldo?.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
              $darkMode={darkMode}
            />

            {/* CAMPO QUE PODE EDITAR */}
            <Input 
              $darkMode={darkMode}
              value={apelido}
              onChange={e => setApelido(e.target.value)}
              readOnly={!isEditing}
            />

            {/* BOTÕES */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginTop: 16 }}>
              {/* Botão deletar no canto inferior esquerdo */}
              <Button 
                style={{ background: '#ef4444', color: '#fff' }} 
                onClick={async () => {
                  if (window.confirm('Tem certeza que deseja deletar esta conta?')) {
                    try {
                      await accountService.delete(selectedAccount.id);
                      setAccounts(prev => prev.filter(acc => acc.id !== selectedAccount.id));
                      setShowModal(false);
                    } catch (err) {
                      alert('Erro ao deletar conta');
                      console.error(err);
                    }
                  }
                }}
                $darkMode={darkMode}
              >
                🗑️ Deletar Conta
              </Button>

              <div style={{ display: "flex", gap: 12 }}>
                {!isEditing ? (
                  <>
                    <Button onClick={() => setShowModal(false)} $darkMode={darkMode}>Fechar</Button>
                    <Button $primary onClick={() => setIsEditing(true)}>Editar Apelido</Button>
                  </>
                ) : (
                  <>
                    <Button onClick={() => { setIsEditing(false); setApelido(selectedAccount.apelido); }} $darkMode={darkMode}>
                      Cancelar
                    </Button>
                    <Button $primary onClick={handleSaveApelido}>Salvar</Button>
                  </>
                )}
              </div>
            </div>
          </ModalCard>
        </ModalOverlay>
      )}

    </AccountsContainer>
  );
};

export default Contas;
