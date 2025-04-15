import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import api from '../services/api';
import { useToast } from '../utils/toast';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    tiposImoveis: [],
    valoresMedios: [],
    statusImoveis: []
  });
  const { showToast, Toast } = useToast();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/imoveis/dashboard');
      console.log('Dados recebidos:', response.data);
      
      if (!response.data) {
        throw new Error('Dados inválidos recebidos do servidor');
      }

      setDashboardData({
        tiposImoveis: response.data.tiposImoveis || [],
        valoresMedios: response.data.valoresMedios || [],
        statusImoveis: response.data.statusImoveis || []
      });
    } catch (error: any) {
      console.error('Erro ao carregar dados do dashboard:', error);
      console.error('Resposta do servidor:', error.response?.data);
      console.error('Status:', error.response?.status);
      
      showToast(
        error.response?.data?.message || 'Erro ao carregar dados do dashboard',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Toast />
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Gráfico de Tipos de Imóveis */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Distribuição por Tipo de Imóvel
            </Typography>
            {dashboardData.tiposImoveis.length > 0 ? (
              <BarChart
                width={500}
                height={300}
                data={dashboardData.tiposImoveis}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tipo" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="quantidade" fill="#8884d8" />
              </BarChart>
            ) : (
              <Typography>Nenhum dado disponível</Typography>
            )}
          </Paper>
        </Grid>

        {/* Gráfico de Valores Médios */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Valores Médios por Tipo
            </Typography>
            {dashboardData.valoresMedios.length > 0 ? (
              <BarChart
                width={500}
                height={300}
                data={dashboardData.valoresMedios}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tipo" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="valorMedio" fill="#82ca9d" />
              </BarChart>
            ) : (
              <Typography>Nenhum dado disponível</Typography>
            )}
          </Paper>
        </Grid>

        {/* Gráfico de Status */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Distribuição por Status
            </Typography>
            {dashboardData.statusImoveis.length > 0 ? (
              <PieChart width={500} height={300}>
                <Pie
                  data={dashboardData.statusImoveis}
                  cx={250}
                  cy={150}
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="quantidade"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {dashboardData.statusImoveis.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            ) : (
              <Typography>Nenhum dado disponível</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}; 