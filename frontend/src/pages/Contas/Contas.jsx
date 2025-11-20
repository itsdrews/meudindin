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
  const [showModal, setShowModal] = useState(false);
  
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [apelido, setApelido] = useState("");

  

  const [form, setForm] = useState({
    apelido: "",
    tipo: "Corrente",
    banco: "",
    agencia: "",
    numero: "",
    saldo: ""
  });

  // Carrega contas do backend
  useEffect(() => {
    async function load() {
      const data = await accountService.list();
      setAccounts(data);
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

    
    const payload = {
      numero: form.numero,
      agencia: form.agencia ? Number(form.agencia) : 0,
      codBanco: form.codBanco ? Number(form.codBanco) : 0,
      tipo: form.tipo,
      banco: form.banco,
      saldo: form.saldo ? Number(form.saldo) : 0,
      apelido: form.apelido,
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

      setShowModal(false);
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
            $primary 
          >
            ↻ Atualizar
          </Button>
        </Actions>
      </Header>

      {/* LISTA */}
      <AccountList>
        {accounts.map(acc => (
          <AccountCard key={acc.id} $darkMode={darkMode} onClick={() =>openViewModal(acc.id)}>
            <h3 style={{ margin: 0 }}>{acc.apelido}</h3>
            <p>{acc.tipo} • {acc.banco}</p>
            <strong>R$ {acc.saldo?.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</strong>
          </AccountCard>
        ))}
      </AccountList>

     {/* MODAL */}
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
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 16 }}>

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
          </ModalCard>
        </ModalOverlay>
      )}

    </AccountsContainer>
  );
};

export default Contas;
