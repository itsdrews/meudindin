import api from './api';

const transactionService = {
  create: async (accountId, payload) => {
    const res = await api.post(`/contas/${accountId}/transacoes`, payload);
    return res.data;
  },
  listAll: async () => {
    const res = await api.get('/transacoes');
    return res.data;
  },
  listByAccountId: async (accountId) => {
    return api.get(`/contas/${accountId}/transacoes`).then(res => res.data);
  },
  update: async (transactionId, numeroConta, payload) => {
    const res = await api.patch(`/contas/${numeroConta}/transacoes/${transactionId}`, payload);
    return res.data;
  }
};

export default transactionService;
