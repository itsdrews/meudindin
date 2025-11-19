import api from './api';

const accountService = {

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
  }

};

export default accountService;