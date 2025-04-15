import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import axios from 'axios';
import { useToast } from '../utils/toast';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { showToast, Toast } = useToast();
  const [loginType, setLoginType] = useState<'email' | 'username'>('email');
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });

  const handleLoginTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newType: 'email' | 'username',
  ) => {
    if (newType !== null) {
      setLoginType(newType);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const loginData = loginType === 'email' 
        ? { email: formData.email, password: formData.password }
        : { username: formData.username, password: formData.password };

      const response = await axios.post('http://localhost:3001/auth/login', loginData);
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/');
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Erro ao fazer login', 'error');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Toast />
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 400,
          width: '100%',
        }}
      >
        <Typography variant="h4" gutterBottom align="center">
          Login
        </Typography>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
          <ToggleButtonGroup
            value={loginType}
            exclusive
            onChange={handleLoginTypeChange}
            aria-label="tipo de login"
          >
            <ToggleButton value="email" aria-label="email">
              Email
            </ToggleButton>
            <ToggleButton value="username" aria-label="usuário">
              Usuário
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Box component="form" onSubmit={handleSubmit}>
          {loginType === 'email' ? (
            <TextField
              fullWidth
              label="Email"
              type="email"
              margin="normal"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          ) : (
            <TextField
              fullWidth
              label="Nome de Usuário"
              margin="normal"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          )}
          <TextField
            fullWidth
            label="Senha"
            type="password"
            margin="normal"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
          >
            Entrar
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}; 