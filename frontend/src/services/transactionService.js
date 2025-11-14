import api from './api';

const transactionService = {
  create: async (payload) => {
    const res = await api.post('/transacoes', payload);
    return res.data;
  },
  list: async () => {
    const res = await api.get('/transacoes');
    return res.data;
  }
};

export default transactionService;
