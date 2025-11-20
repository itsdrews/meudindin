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
    const res = await api.put(`/metas/${id}`, data);
    return res.data;
  },

  // Deletar meta
  remove: async (id) => {
    const res = await api.delete(`/metas/${id}`);
    return res.data;
  }

};

export default goalsService;
