import api from "./api";

const goalsService = {
  
  // Listar metas
  list: async () => {
    const res = await api.get("/metas");
    return res.data;
  },

  // Criar meta vinculada a uma conta
  create: async (conta_id, data) => {
    const res = await api.post(`/contas/${conta_id}/metas`, data);
    return res.data;
  },

  // Buscar meta por ID
  getById: async (id) => {
    const res = await api.get(`/metas/${id}`);
    return res.data;
  },

  // Atualizar meta existente
  update: async (id, data) => {
    const results = {};

    // Atualizar nome
    if (data.nome !== undefined) {
      const r = await api.patch(`/metas/${id}/nome`, { nome: data.nome });
      results.nome = r.data;
    }

    // Atualizar valor alvo
    if (data.valor_alvo !== undefined) {
      const r = await api.patch(`/metas/${id}/valor-alvo`, { valor_alvo: data.valor_alvo });
      results.valor_alvo = r.data;
    }

    // Atualizar data limite
    if (data.data_limite !== undefined) {
      const r = await api.patch(`/metas/${id}/data-limite`, {
        data_limite: data.data_limite.split("T")[0]
      });
      results.data_limite = r.data;
    }

    // Atualizar progresso (valor atual)
    if (data.valor !== undefined) {
      const r = await api.patch(`/metas/${id}/progresso`, { valor: data.valor });
      results.valor = r.data;
    }

    return results;
  },

  // Deletar meta
  remove: async (id) => {
    const res = await api.delete(`/metas/${id}`);
    return res.data;
  }

};

export default goalsService;
