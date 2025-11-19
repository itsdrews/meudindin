import api from './api';

const accountService = {
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
