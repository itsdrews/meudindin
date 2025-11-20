import React, { useState, useEffect } from "react";
import goalsService from "../../services/goalsService";
import styled from "styled-components";
import accountService from "../../services/accountService";

// ====================== ESTILOS ======================
const GoalsContainer = styled.div`width: 100%;`;
const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;
const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${(p) => (p.$darkMode ? "#f8fafc" : "#0f172a")};
  margin: 0;
`;
const Subtitle = styled.p`
  color: ${(p) => (p.$darkMode ? "#a78bfa" : "#64748b")};
  margin: 4px 0 0 0;
`;
const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 12px 22px;
  border: none;
  border-radius: 14px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
  &:hover { transform: translateY(-2px); }
`;
const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px;
  margin-bottom: 32px;
`;
const SummaryCard = styled.div`
  background: ${(p) => (p.$darkMode ? "#2d1b4e" : "white")};
  border: 1px solid ${(p) => (p.$darkMode ? "#4c1d95" : "#e2e8f0")};
  padding: 24px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const SummaryLabel = styled.p`
  margin: 0;
  color: ${(p) => (p.$darkMode ? "#c4b5fd" : "#64748b")};
  font-weight: 600;
`;
const SummaryValue = styled.h3`
  margin: 5px 0 0;
  font-size: 2rem;
  color: ${(p) => (p.$darkMode ? "white" : "#0f172a")};
`;
const GoalsList = styled.div`display: flex; flex-direction: column; gap: 22px;`;
const GoalCard = styled.div`
  background: ${(p) => (p.$darkMode ? "#2d1b4e" : "white")};
  border: 1px solid ${(p) => (p.$darkMode ? "#4c1d95" : "#e2e8f0")};
  border-radius: 18px;
  padding: 22px 26px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const GoalHeader = styled.div`display: flex; justify-content: space-between; align-items: center;`;
const GoalTitle = styled.h3`
  margin: 0;
  color: ${(p) => (p.$darkMode ? "#f8fafc" : "#0f172a")};
  font-size: 1.2rem;
  font-weight: 600;
`;
const GoalTag = styled.span`
  padding: 4px 12px;
  background: ${(p) => (p.$darkMode ? "#3b2167" : "#edf2ff")};
  color: ${(p) => (p.$darkMode ? "#c4b5fd" : "#667eea")};
  border-radius: 8px;
  font-size: 0.75rem;
  margin-left: 12px;
`;
const GoalActions = styled.div`
  display: flex;
  gap: 14px;
  span {
    cursor: pointer;
    font-size: 1.2rem;
    transition: 0.2s;
    color: ${(p) => (p.$darkMode ? "#c4b5fd" : "#64748b")};
  }
  span:hover { transform: scale(1.15); color: ${(p) => (p.$darkMode ? "white" : "#333")}; }
`;
const ProgressBar = styled.div`
  width: 100%;
  height: 10px;
  border-radius: 10px;
  background: ${(p) => (p.$darkMode ? "#4c1d95" : "#e2e8f0")};
  overflow: hidden;
`;
const ProgressFill = styled.div`
  height: 100%;
  background: #667eea;
  width: ${(p) => p.$percent}%;
  transition: width 0.4s ease;
`;
const GoalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: ${(p) => (p.$darkMode ? "#a78bfa" : "#475569")};
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
  background: ${(p) => (p.$darkMode ? "#2d1b4e" : "white")};
  border: 1px solid ${(p) => (p.$darkMode ? "#4c1d95" : "#e2e8f0")};
  width: 500px;
  padding: 28px;
  border-radius: 16px;
`;
const Input = styled.input`
  width: 100%;
  background: ${(p) => (p.$darkMode ? "#3b2167" : "white")};
  border: 1px solid ${(p) => (p.$darkMode ? "#4c1d95" : "#cbd5e1")};
  padding: 12px;
  border-radius: 10px;
  color: ${(p) => (p.$darkMode ? "white" : "#0f172a")};
  margin-bottom: 14px;
`;
const ModalRow = styled.div`display: flex; gap: 14px;`;
const SaveBtn = styled.button`
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 12px;
  margin-top: 10px;
  cursor: pointer;
  font-weight: 600;
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  margin-bottom: 12px;
  border-radius: 10px;
  background: ${p => p.$darkMode ? '#3b2167' : 'white'};
  color: ${p => p.$darkMode ? 'white' : '#0f172a'};
  border: 1px solid ${p => p.$darkMode ? '#4c1d95' : '#cbd5e1'};

  ${p => p.readOnly && `
    pointer-events: none;
    user-select: none;
    opacity: 0.75;
    cursor: default;
  `}

  &:focus { outline: none; }
`;


// ====================== COMPONENTE ======================
const Goals = ({ darkMode }) => {
  const [goals, setGoals] = useState([]);
  const [conta, setConta] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);


  const categorias = ["Investimentos", "Viagem", "Educação", "Emergência", "Compras"];

  const [contas, setContas] = useState([]);

  useEffect(() => {
    async function loadAccounts() {
      try {
        const data = await accountService.list(); 
        setContas(data);
      } catch (err) {
        console.error("Erro ao carregar contas:", err);
      }
    }

    loadAccounts();
  }, []);

  // ===== Carregar metas e contas =====
  useEffect(() => {
    async function load() {
      try {
        const metas = await goalsService.list();
        setGoals(
          metas.map(meta => ({
            id: meta.id,
            titulo: meta.nome,
            categoria: meta.descricao || "Sem categoria",
            total: Number(meta.valor_alvo) || 0,
            atual: Number(meta.valor) || 0,
            prazo: formatDate(meta.dataLimite),
            conta_id: meta.conta_id
          }))
        );

        const res = await fetch("http://localhost:8080/contas", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("financial_token")}`
          }
        });
        const contas = await res.json();
        if (Array.isArray(contas) && contas.length > 0) setConta(contas[0]);
      } catch (err) {
        console.error("Erro ao carregar metas ou contas:", err);
      }
    }
    load();
  }, []);

  // ===== Formatador de data =====
  const formatDate = (isoDate) => {
    const d = new Date(isoDate);
    return d.toLocaleDateString("pt-BR");
  };

  // ===== Criar ou editar meta =====
  const handleSave = async (e) => {
  e.preventDefault();

  if (!editingGoal) return;

  try {
    // Payload comum para criar ou editar
    const payload = {
      nome: editingGoal.titulo,
      descricao: editingGoal.categoria,
      valor_alvo: Number(editingGoal.total),
      data_limite: editingGoal.prazo,
      valor: Number(editingGoal.atual),
      conta_id: editingGoal.conta_id
    };

    let result;

    if (editingGoal.id) {
      // ------------------
      //   EDITAR META
      // ------------------
      result = await goalsService.update(editingGoal.id, payload);

      setGoals(prev =>
        prev.map(g =>
          g.id === editingGoal.id
            ? {
                ...g,
                titulo: result.nome,
                categoria: result.descricao,
                total: result.valor_alvo,
                prazo: new Date(result.dataLimite).toLocaleDateString("pt-BR"),
                atual: result.valor,
                conta_id: result.conta_id
              }
            : g
        )
      );
    } else {
      // ------------------
      //   CRIAR META
      // ------------------


      result = await goalsService.create(editingGoal.conta_id,payload);

      setGoals(prev => [
        ...prev,
        {
          id: result.id,
          titulo: result.nome,
          categoria: result.descricao,
          total: result.valor_alvo,
          prazo: new Date(result.dataLimite).toLocaleDateString("pt-BR"),
          atual: result.valor,
          conta_id: result.conta_id
        }
      ]);
    }

    // Fechar modal
    setEditingGoal(null);
    setShowModal(false);

  } catch (err) {
    console.error("Erro ao salvar meta:", err);
    alert("Falha ao salvar meta.");
  }
};



  // ===== Excluir meta =====
  const handleDelete = async (id) => {
    if (!window.confirm("Deseja realmente deletar esta meta?")) return;

    try {
      await goalsService.remove(id);
      setGoals(prev => prev.filter(g => g.id !== id));
    } catch (err) {
      console.error("Erro ao deletar meta:", err);
      alert("Falha ao deletar meta. Veja o console.");
    }
  };

  // ===== Editar meta =====
  const handleEdit = (goal) => {
    if (!goal.id) return console.error("Meta sem ID", goal);

    setEditingGoal({ ...goal });
    setShowModal(true);
  };

  return (
    <GoalsContainer>
      <HeaderRow>
        <div>
          <Title $darkMode={darkMode}>Metas</Title>
          <Subtitle $darkMode={darkMode}>Acompanhe suas economias</Subtitle>
        </div>
        <AddButton onClick={() => {
          setEditingGoal({
            id: null,
            titulo: "",
            categoria: "",
            conta_id: "",
            total:0,
            atual:0       // <-- IMPORTANTE
          });

          setShowModal(true);
        }}>➕ Nova</AddButton>
      </HeaderRow>

      {/* SUMMARY */}
      <SummaryGrid>
        <SummaryCard $darkMode={darkMode}>
          <SummaryLabel>Total</SummaryLabel>
          <SummaryValue>{goals.length}</SummaryValue>
        </SummaryCard>
        <SummaryCard $darkMode={darkMode}>
          <SummaryLabel>Concluídas</SummaryLabel>
          <SummaryValue>{goals.filter(g => g.atual >= g.total).length}</SummaryValue>
        </SummaryCard>
      </SummaryGrid>

      {/* LISTA DE METAS */}
      <GoalsList>
        {goals.map(goal => {
          const percent = Math.round((goal.atual / goal.total) * 100);
          return (
            <GoalCard key={goal.id} $darkMode={darkMode}>
              <GoalHeader>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <GoalTitle $darkMode={darkMode}>{goal.titulo}</GoalTitle>
                  <GoalTag $darkMode={darkMode}>{goal.categoria}</GoalTag>
                </div>
                <GoalActions $darkMode={darkMode}>
                  <span onClick={() => handleEdit(goal)}>✏️</span>
                  <span onClick={() => handleDelete(goal.id)}>🗑️</span>
                </GoalActions>
              </GoalHeader>

              <span style={{ color: darkMode ? "#c4b5fd" : "#64748b" }}>
                R$ {goal.total.toLocaleString("pt-BR")} até {goal.prazo}
              </span>

              <ProgressBar $darkMode={darkMode}>
                <ProgressFill $percent={percent} />
              </ProgressBar>

              <GoalFooter $darkMode={darkMode}>
                <span>{percent}%</span>
                <span>R$ {goal.atual.toLocaleString("pt-BR")}</span>
                <span>Faltam: R$ {(goal.total - goal.atual).toLocaleString("pt-BR")}</span>
              </GoalFooter>
            </GoalCard>
          );
        })}
      </GoalsList>

      {/* MODAL */}
      {showModal && (
        <ModalOverlay>
          <ModalCard $darkMode={darkMode}>
            <AddButton
              onClick={() => setShowModal(false)}

            >Voltar</AddButton>

            <h3 style={{ color: darkMode ? "white" : "#0f172a" }}>
              {editingGoal.id ? "Editar Meta" : "Nova Meta"}
            </h3>

            <form onSubmit={handleSave}>
              <Input
                $darkMode={darkMode}
                placeholder="Título"
                required
                value={editingGoal?.titulo || ""}
                onChange={e => setEditingGoal({...editingGoal, titulo: e.target.value})}
              />

             <Input
                as="select"
                $darkMode={darkMode}
                required
                value={editingGoal?.categoria || ""}
                onChange={e => setEditingGoal({ ...editingGoal, categoria: e.target.value })}
              >
                <option value="" disabled>Selecione uma categoria</option>
                {categorias.map((categoria) => (
                  <option key={categoria} value={categoria}>
                    {categoria}
                  </option>
                ))}
              </Input>

              <ModalRow>
                <Input
                  $darkMode={darkMode}
                  type="number"
                  placeholder="Valor Alvo"
                  required
                  value={editingGoal?.total ??" "}
                  onChange={e => setEditingGoal({...editingGoal, total: Number(e.target.value)})}
                />

                <Input
                  $darkMode={darkMode}
                  type="date"
                  placeholder="Data Alvo (dd/mm/aaaa)"
                  required
                  value={editingGoal?.prazo || " "}
                  onChange={e => setEditingGoal({...editingGoal, prazo: e.target.value})}
                />
              </ModalRow>
              <Select
                  $darkMode={darkMode}
                  required
                  value={editingGoal?.conta_id || ""}
                  onChange={e => setEditingGoal({...editingGoal, conta_id: Number(e.target.value)})}
                >
                  <option value="">Selecione uma conta</option>

                  {contas.map(conta => (
                    <option key={conta.id} value={conta.id}>
                      {conta.apelido} — {conta.banco} ({conta.numero})
                    </option>
                  ))}
                </Select>


              <SaveBtn type="submit">Salvar Meta</SaveBtn>
            </form>
          </ModalCard>
        </ModalOverlay>
      )}
    </GoalsContainer>
  );
};

export default Goals;
