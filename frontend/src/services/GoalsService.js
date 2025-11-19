const API_URL = "http://localhost:8080";

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("financial_token")}`,
  };
}

const goalsService = {
  // Listar todas as metas
  async list() {
    const res = await fetch(`${API_URL}/metas`, {
      method: "GET",
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Erro ao carregar metas");
    return res.json();
  },

  // Criar meta
  async create(contaId, data) {
    const res = await fetch(`${API_URL}/contas/${contaId}/metas`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Erro ao criar meta");
    return res.json();
  },

  // Buscar meta por ID
  async find(id) {
    const res = await fetch(`${API_URL}/metas/${id}`, {
      method: "GET",
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Erro ao buscar meta");
    return res.json();
  },

  // Atualizar meta completa (nome, valor, data, categoria, etc)
  async update(id, data) {
    const res = await fetch(`${API_URL}/metas/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Erro ao atualizar meta");
    return res.json();
  },

  // Deletar meta
  async remove(id) {
    const res = await fetch(`${API_URL}/metas/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Erro ao deletar meta");
    return res.json();
  },
};

export default goalsService;
