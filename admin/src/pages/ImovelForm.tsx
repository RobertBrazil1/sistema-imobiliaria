import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Grid,
  Typography,
  Paper,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Alert,
  Snackbar,
  CardMedia,
  MobileStepper,
  IconButton,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Image as ImageIcon,
  Delete as DeleteIcon,
  DeleteForever as DeleteForeverIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from '@mui/icons-material';
import axios from 'axios';

interface ImovelFormData {
  titulo: string;
  descricao: string;
  valor: number;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  area: number;
  quartos: number;
  banheiros: number;
  vagasGaragem: number;
  fotos: string[];
  tipo: 'venda' | 'aluguel';
  tipoImovel: 'casa' | 'apartamento' | 'terreno';
  estadoImovel: 'novo' | 'semi-novo';
  aceitaFinanciamento: boolean;
}

export const ImovelForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ImovelFormData>({
    titulo: '',
    descricao: '',
    valor: 0,
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    area: 0,
    quartos: 0,
    banheiros: 0,
    vagasGaragem: 0,
    fotos: [],
    tipo: 'venda',
    tipoImovel: 'casa',
    estadoImovel: 'novo',
    aceitaFinanciamento: false,
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'success'>('error');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchImovel();
    }
  }, [id]);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setError(null);
    setSuccess(null);
  };

  const showError = (message: string) => {
    setError(message);
    setSnackbarSeverity('error');
    setOpenSnackbar(true);
  };

  const showSuccess = (message: string) => {
    setSuccess(message);
    setSnackbarSeverity('success');
    setOpenSnackbar(true);
  };

  const fetchImovel = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/imoveis/${id}`);
      setFormData(response.data);
    } catch (error: any) {
      showError(`Erro ao carregar imóvel: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      
      // Adicionar os dados do formulário
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'fotos') {
          formDataToSend.append(key, value.toString());
        }
      });

      // Adicionar as fotos existentes
      formData.fotos.forEach((foto) => {
        formDataToSend.append('fotos[]', foto);
      });

      // Adicionar os novos arquivos
      selectedFiles.forEach((file) => {
        formDataToSend.append('fotos', file);
      });

      const url = id 
        ? `http://localhost:3001/imoveis/${id}`
        : 'http://localhost:3001/imoveis';
      
      const method = id ? 'put' : 'post';
      
      await axios({
        method,
        url,
        data: formDataToSend,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      showSuccess(id ? 'Imóvel atualizado com sucesso!' : 'Imóvel cadastrado com sucesso!');
      setTimeout(() => {
        navigate('/imoveis');
      }, 2000);
    } catch (error: any) {
      let errorMessage = 'Erro ao salvar imóvel';
      
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = 'Não foi possível conectar ao servidor. Verifique se o servidor está rodando.';
      } else {
        errorMessage = error.message || errorMessage;
      }
      
      showError(errorMessage);
    }
  };

  const getImageUrls = (fotos: string[]): string[] => {
    if (fotos && fotos.length > 0) {
      return fotos.map(foto => `http://localhost:3001/uploads/${foto}`);
    }
    return [];
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const imageUrls = getImageUrls(formData.fotos);
  const maxSteps = imageUrls.length;

  const handleDeleteImage = (imageUrl: string) => {
    setImageToDelete(imageUrl);
    setOpenDeleteDialog(true);
  };

  const confirmDeleteImage = () => {
    if (imageToDelete) {
      const imageName = imageToDelete.split('/').pop();
      setFormData(prev => ({
        ...prev,
        fotos: prev.fotos.filter(foto => foto !== imageName)
      }));
      setImageToDelete(null);
      setOpenDeleteDialog(false);
    }
  };

  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    const newFotos = [...formData.fotos];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < newFotos.length) {
      [newFotos[index], newFotos[newIndex]] = [newFotos[newIndex], newFotos[index]];
      setFormData(prev => ({
        ...prev,
        fotos: newFotos
      }));
    }
  };

  const handleDeleteAllImages = () => {
    setFormData(prev => ({
      ...prev,
      fotos: []
    }));
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {id ? 'Editar Imóvel' : 'Novo Imóvel'}
      </Typography>

      {imageUrls.length > 0 && (
        <Box sx={{ mb: 3, position: 'relative' }}>
          <Box sx={{ height: 300, bgcolor: 'grey.200', position: 'relative' }}>
            <CardMedia
              component="img"
              height="300"
              image={imageUrls[activeStep]}
              alt={`Imagem ${activeStep + 1}`}
              sx={{ objectFit: 'cover' }}
            />
            {maxSteps > 1 && (
              <MobileStepper
                steps={maxSteps}
                position="static"
                activeStep={activeStep}
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
                    onClick={handleNext}
                    disabled={activeStep === maxSteps - 1}
                    sx={{ color: 'white' }}
                  >
                    <KeyboardArrowRight />
                  </IconButton>
                }
                backButton={
                  <IconButton
                    size="small"
                    onClick={handleBack}
                    disabled={activeStep === 0}
                    sx={{ color: 'white' }}
                  >
                    <KeyboardArrowLeft />
                  </IconButton>
                }
              />
            )}
          </Box>
        </Box>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Título"
            name="titulo"
            value={formData.titulo}
            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Descrição"
            name="descricao"
            multiline
            rows={4}
            value={formData.descricao}
            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Valor"
            name="valor"
            type="number"
            value={formData.valor}
            onChange={(e) => setFormData({ ...formData, valor: Number(e.target.value) })}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Tipo"
            name="tipo"
            value={formData.tipo}
            onChange={(e) => setFormData({ ...formData, tipo: e.target.value as 'venda' | 'aluguel' })}
            required
          >
            <MenuItem value="venda">Venda</MenuItem>
            <MenuItem value="aluguel">Aluguel</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Tipo de Imóvel"
            name="tipoImovel"
            value={formData.tipoImovel}
            onChange={(e) => setFormData({ ...formData, tipoImovel: e.target.value as 'casa' | 'apartamento' | 'terreno' })}
            required
          >
            <MenuItem value="casa">Casa</MenuItem>
            <MenuItem value="apartamento">Apartamento</MenuItem>
            <MenuItem value="terreno">Terreno</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Estado do Imóvel"
            name="estadoImovel"
            value={formData.estadoImovel}
            onChange={(e) => setFormData({ ...formData, estadoImovel: e.target.value as 'novo' | 'semi-novo' })}
            required
          >
            <MenuItem value="novo">Novo</MenuItem>
            <MenuItem value="semi-novo">Semi-novo</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.aceitaFinanciamento}
                onChange={(e) => setFormData({ ...formData, aceitaFinanciamento: e.target.checked })}
              />
            }
            label="Aceita Financiamento"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Endereço"
            name="endereco"
            value={formData.endereco}
            onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
            required
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Cidade"
            name="cidade"
            value={formData.cidade}
            onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
            required
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Estado"
            name="estado"
            value={formData.estado}
            onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
            required
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="CEP"
            name="cep"
            value={formData.cep}
            onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Área (m²)"
            name="area"
            type="number"
            value={formData.area}
            onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Quartos"
            name="quartos"
            type="number"
            value={formData.quartos}
            onChange={(e) => setFormData({ ...formData, quartos: Number(e.target.value) })}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Banheiros"
            name="banheiros"
            type="number"
            value={formData.banheiros}
            onChange={(e) => setFormData({ ...formData, banheiros: Number(e.target.value) })}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Vagas de Garagem"
            name="vagasGaragem"
            type="number"
            value={formData.vagasGaragem}
            onChange={(e) => setFormData({ ...formData, vagasGaragem: Number(e.target.value) })}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Fotos do Imóvel
            </Typography>
            {formData.fotos.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Grid container spacing={1}>
                  {formData.fotos.map((foto, index) => (
                    <Grid item xs={6} sm={4} md={3} key={foto}>
                      <Box
                        sx={{
                          position: 'relative',
                          height: '150px',
                          borderRadius: '4px',
                          overflow: 'hidden',
                          '&:hover .image-actions': {
                            opacity: 1,
                          },
                        }}
                      >
                        <CardMedia
                          component="img"
                          image={`http://localhost:3001/uploads/${foto}`}
                          alt={`Imagem ${index + 1}`}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                        <Box
                          className="image-actions"
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'rgba(0, 0, 0, 0.5)',
                            opacity: 0,
                            transition: 'opacity 0.2s',
                            gap: 1,
                          }}
                        >
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() => handleMoveImage(index, 'up')}
                              disabled={index === 0}
                              sx={{ color: 'white' }}
                            >
                              <ArrowUpwardIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleMoveImage(index, 'down')}
                              disabled={index === formData.fotos.length - 1}
                              sx={{ color: 'white' }}
                            >
                              <ArrowDownwardIcon />
                            </IconButton>
                          </Box>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteImage(`http://localhost:3001/uploads/${foto}`)}
                            sx={{ color: 'white' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteForeverIcon />}
                    onClick={handleDeleteAllImages}
                    size="small"
                  >
                    Excluir Todas
                  </Button>
                </Box>
              </Box>
            )}

            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
            >
              Selecionar Fotos
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
            {selectedFiles.length > 0 && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {selectedFiles.length} arquivo(s) selecionado(s)
              </Typography>
            )}
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/imoveis')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              {id ? 'Atualizar' : 'Salvar'}
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir esta imagem?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
          <Button onClick={confirmDeleteImage} color="error">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {error || success}
        </Alert>
      </Snackbar>
    </Box>
  );
}; 