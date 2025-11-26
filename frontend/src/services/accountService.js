import api from './api';

const accountService = {
  delete: async (id) => {
    const res = await api.delete(`/contas/${id}`);
    return res.data;
  },

  create: async (data) => {
    const res = await api.post('/contas', data);
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/contas/${id}`);
    return res.data;
  },

  list: async () => {
    const res = await api.get('/contas');
    return res.data;
  },
  updateAll: async () => {
    const res = await api.patch("/contas/atualizar-saldos", {});
    return res.data;
},
  update: async (id, data) => {
  const res = await api.patch(`/contas/${id}`, data);
  return res.data;
},

};

export default accountService;