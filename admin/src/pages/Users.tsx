import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Alert,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import api from '../utils/axios';
import { useToast } from '../utils/toast';

interface User {
  id: string;
  username: string;
  nome: string;
  email: string;
  role: string;
}

export const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    nome: '',
    email: '',
    password: '',
    role: 'user',
  });
  const { showToast, Toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Verificar se o usuário tem permissão
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('[Users] Usuário atual:', user);
      
      if (user.role !== 'superuser') {
        setError('Você não tem permissão para acessar esta página');
        showToast('Você não tem permissão para acessar esta página', 'error');
        return;
      }

      // Verificar se o token existe
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Usuário não autenticado');
        showToast('Usuário não autenticado', 'error');
        return;
      }

      console.log('[Users] Iniciando busca de usuários');
      const response = await api.get('/users');
      console.log('[Users] Usuários recebidos:', response.data);
      
      setUsers(response.data);
    } catch (error: any) {
      console.error('[Users] Erro ao carregar usuários:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao carregar usuários';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      username: '',
      nome: '',
      email: '',
      password: '',
      role: 'user',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('[Users] Tentando criar novo usuário:', {
        ...formData,
        password: '***'
      });
      
      await api.post('/auth/register', formData);
      showToast('Usuário criado com sucesso!', 'success');
      handleClose();
      fetchUsers();
    } catch (error: any) {
      console.error('[Users] Erro ao criar usuário:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao criar usuário';
      showToast(errorMessage, 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      console.log('[Users] Tentando excluir usuário:', id);
      
      await api.delete(`/users/${id}`);
      showToast('Usuário excluído com sucesso!', 'success');
      fetchUsers();
    } catch (error: any) {
      console.error('[Users] Erro ao excluir usuário:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao excluir usuário';
      showToast(errorMessage, 'error');
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Carregando usuários...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Toast />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Usuários</Typography>
        <Button variant="contained" onClick={handleOpen}>
          Novo Usuário
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Usuário</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Função</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.nome}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(user.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Novo Usuário</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="username"
              label="Nome de Usuário"
              type="text"
              fullWidth
              value={formData.username}
              onChange={handleChange}
              required
            />
            <TextField
              margin="dense"
              name="nome"
              label="Nome Completo"
              type="text"
              fullWidth
              value={formData.nome}
              onChange={handleChange}
              required
            />
            <TextField
              margin="dense"
              name="email"
              label="Email"
              type="email"
              fullWidth
              value={formData.email}
              onChange={handleChange}
              required
            />
            <TextField
              margin="dense"
              name="password"
              label="Senha"
              type="password"
              fullWidth
              value={formData.password}
              onChange={handleChange}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" variant="contained">
              Criar
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}; 