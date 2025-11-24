import api from './api';

const userService = {
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  updateName: async (id, nome) => {
    const res = await api.patch(`/clientes/${id}/nome`, { nome });
    return res.data;
  },

  updateEmail(id, email, senha) {
    return api.patch(`/clientes/${id}/email`, { email, senha });
  },

  updatePassword: async (id, currentPassword, newPassword) => {
    const res = await api.patch(`/clientes/${id}/password`, { currentPassword, newPassword });
    return res.data;
  },

  deleteAccount: async (id) => {
    const res = await api.delete(`/clientes/${id}`);
    return res.data;
  }
};

export default userService;
