import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  MobileStepper,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from '@mui/icons-material';
import axios from 'axios';

interface Imovel {
  id: string;
  titulo: string;
  descricao: string;
  valor: number;
  tipo: 'venda' | 'aluguel';
  tipoImovel: 'casa' | 'apartamento' | 'terreno';
  estadoImovel: 'novo' | 'semi-novo';
  aceitaFinanciamento: boolean;
  fotos: string[];
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  area: number;
  quartos: number;
  banheiros: number;
  vagasGaragem: number;
}

export const Imoveis: React.FC = () => {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [selectedImovel, setSelectedImovel] = useState<Imovel | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [activeStep, setActiveStep] = useState<{ [key: string]: number }>({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchImoveis();
  }, []);

  const fetchImoveis = async () => {
    try {
      const response = await axios.get('http://localhost:3001/imoveis');
      setImoveis(response.data);
    } catch (error) {
      console.error('Erro ao carregar imóveis:', error);
    }
  };

  const handleDelete = async () => {
    if (selectedImovel) {
      try {
        await axios.delete(`http://localhost:3001/imoveis/${selectedImovel.id}`);
        fetchImoveis();
        setOpenDeleteDialog(false);
        setSelectedImovel(null);
      } catch (error) {
        console.error('Erro ao deletar imóvel:', error);
      }
    }
  };

  const getImageUrls = (fotos: string[]): string[] => {
    if (fotos && fotos.length > 0) {
      return fotos.map(foto => `http://localhost:3001/uploads/${foto}`);
    }
    return [];
  };

  const handleNext = (imovelId: string) => {
    setActiveStep(prev => ({
      ...prev,
      [imovelId]: (prev[imovelId] || 0) + 1
    }));
  };

  const handleBack = (imovelId: string) => {
    setActiveStep(prev => ({
      ...prev,
      [imovelId]: (prev[imovelId] || 0) - 1
    }));
  };

  const handleEdit = (imovel: Imovel) => {
    navigate(`/imoveis/editar/${imovel.id}`, { 
      state: { 
        imovel,
        fotosExistentes: imovel.fotos 
      } 
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Imóveis</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/imoveis/novo')}
        >
          Novo Imóvel
        </Button>
      </Box>

      <Grid container spacing={3}>
        {imoveis.map((imovel) => {
          const imageUrls = getImageUrls(imovel.fotos);
          const maxSteps = imageUrls.length;
          const currentStep = activeStep[imovel.id] || 0;

          return (
            <Grid item xs={12} sm={6} md={4} key={imovel.id}>
              <Card>
                <Box sx={{ height: 200, bgcolor: 'grey.200', position: 'relative' }}>
                  {imageUrls.length > 0 ? (
                    <>
                      <CardMedia
                        component="img"
                        height="200"
                        image={imageUrls[currentStep]}
                        alt={imovel.titulo}
                        sx={{ objectFit: 'cover' }}
                      />
                      {maxSteps > 1 && (
                        <>
                          <MobileStepper
                            steps={maxSteps}
                            position="static"
                            activeStep={currentStep}
                            sx={{
                              position: 'absolute',
                              bottom: 0,
                              width: '100%',
                              bgcolor: 'rgba(0, 0, 0, 0.3)',
                              '& .MuiMobileStepper-dot': {
                                backgroundColor: 'white',
                              },
                            }}
                            nextButton={
                              <IconButton
                                size="small"
                                onClick={() => handleNext(imovel.id)}
                                disabled={currentStep === maxSteps - 1}
                                sx={{ color: 'white' }}
                              >
                                <KeyboardArrowRight />
                              </IconButton>
                            }
                            backButton={
                              <IconButton
                                size="small"
                                onClick={() => handleBack(imovel.id)}
                                disabled={currentStep === 0}
                                sx={{ color: 'white' }}
                              >
                                <KeyboardArrowLeft />
                              </IconButton>
                            }
                          />
                        </>
                      )}
                    </>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                      <ImageIcon sx={{ fontSize: 60, color: 'grey.400' }} />
                    </Box>
                  )}
                </Box>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {imovel.titulo}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {imovel.descricao}
                  </Typography>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    R$ {imovel.valor.toLocaleString('pt-BR')}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Chip 
                      label={imovel.tipo} 
                      color="primary" 
                      size="small" 
                      sx={{ mr: 1 }} 
                    />
                    <Chip 
                      label={imovel.tipoImovel} 
                      color="secondary" 
                      size="small" 
                      sx={{ mr: 1 }} 
                    />
                    {imovel.aceitaFinanciamento && (
                      <Chip 
                        label="Aceita Financiamento" 
                        color="success" 
                        size="small" 
                      />
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {imovel.endereco}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {imovel.cidade} - {imovel.estado}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {imovel.quartos} quartos
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {imovel.banheiros} banheiros
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {imovel.vagasGaragem} vagas
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {imovel.area}m²
                      </Typography>
                    </Box>
                    <Box>
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(imovel)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => {
                          setSelectedImovel(imovel);
                          setOpenDeleteDialog(true);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir o imóvel "{selectedImovel?.titulo}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
          <Button onClick={handleDelete} color="error">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 