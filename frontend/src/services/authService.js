import api from './api';

const authService = {
  // Login
  login: async (email, password) => {
    try {
      const response = await api.post('/login', {
        email,
        password
      });
      return response.data;
    } catch (error) {
      // Repassa o erro para ser tratado no componente
      throw error;
    }
  },

  // Registro
  register: async (userData) => {
    try {
      const response = await api.post('/clientes', {
        nome: userData.name,
        email: userData.email,
        cpf: userData.cpf,
        password: userData.password
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('financial_token');
    localStorage.removeItem('user');
  },

};

export default authService;