import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
            onClick={() => navigate('/imoveis')}
          >
            <Typography variant="h6" gutterBottom>
              Imóveis
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Gerencie seus imóveis cadastrados, adicione novos ou edite os existentes.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}; 