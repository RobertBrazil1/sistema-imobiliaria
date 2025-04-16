import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const api = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Erro 401 - Não autorizado
      if (error.response.status === 401) {
        console.error('Token inválido ou expirado');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      
      // Erro 403 - Proibido
      if (error.response.status === 403) {
        console.error('Acesso negado:', error.response.data);
      }
    }
    return Promise.reject(error);
  }
);

export default api; 