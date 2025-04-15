import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Card,
  CardContent,
  CardHeader,
  Divider,
  SelectChangeEvent,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useToast } from '../utils/toast';
import api from '../utils/axios';

interface FormData {
  titulo: string;
  descricao: string;
  valor: string;
  tipo: string;
  tipoImovel: string;
  estadoImovel: string;
  aceitaFinanciamento: boolean;
  endereco: string;
  cidade: string;
  estado: string;
  area: string;
  quartos: string;
  banheiros: string;
  vagasGaragem: string;
  fotos: File[];
  fotosExistentes: string[];
}

const ImovelForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { showToast, Toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    titulo: '',
    descricao: '',
    valor: '',
    tipo: '',
    tipoImovel: '',
    estadoImovel: '',
    aceitaFinanciamento: false,
    endereco: '',
    cidade: '',
    estado: '',
    area: '',
    quartos: '',
    banheiros: '',
    vagasGaragem: '',
    fotos: [],
    fotosExistentes: [],
  });

  useEffect(() => {
    if (id) {
      const fetchImovel = async () => {
        try {
          const response = await api.get(`/imoveis/${id}`);
          const imovel = response.data;
          setFormData({
            titulo: imovel.titulo,
            descricao: imovel.descricao,
            valor: imovel.valor?.toString() || '',
            tipo: imovel.tipo,
            tipoImovel: imovel.tipoImovel,
            estadoImovel: imovel.estadoImovel,
            aceitaFinanciamento: imovel.aceitaFinanciamento || false,
            endereco: imovel.endereco,
            cidade: imovel.cidade,
            estado: imovel.estado,
            area: imovel.area?.toString() || '',
            quartos: imovel.quartos?.toString() || '',
            banheiros: imovel.banheiros?.toString() || '',
            vagasGaragem: imovel.vagasGaragem?.toString() || '',
            fotos: [],
            fotosExistentes: imovel.fotos || [],
          });
        } catch (error: any) {
          showToast(error.response?.data?.message || 'Erro ao carregar imóvel', 'error');
        }
      };
      fetchImovel();
    }
  }, [id, showToast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        fotos: [...prev.fotos, ...newFiles]
      }));
    }
  };

  const handleDeleteImage = async (imageName: string) => {
    try {
      await api.delete(`/imoveis/${id}/fotos/${imageName}`);
      setFormData(prev => ({
        ...prev,
        fotosExistentes: prev.fotosExistentes.filter(foto => foto !== imageName)
      }));
      showToast('Imagem excluída com sucesso!', 'success');
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Erro ao excluir imagem', 'error');
    }
  };

  const handleDeleteNewImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      fotos: prev.fotos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      
      // Adiciona os campos do formulário
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'fotos' && key !== 'fotosExistentes') {
          formDataToSend.append(key, value);
        }
      });

      // Adiciona as novas imagens
      formData.fotos.forEach((file) => {
        formDataToSend.append('fotos', file);
      });

      if (id) {
        await api.put(`/imoveis/${id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        showToast('Imóvel atualizado com sucesso!', 'success');
      } else {
        await api.post('/imoveis', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        showToast('Imóvel criado com sucesso!', 'success');
      }
      navigate('/imoveis');
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Erro ao salvar imóvel', 'error');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Toast />
      <Card>
        <CardHeader
          title={
            <Typography variant="h4" component="h1">
              {id ? 'Editar Imóvel' : 'Novo Imóvel'}
            </Typography>
          }
        />
        <Divider />
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Título"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descrição"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  multiline
                  rows={4}
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
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>R$</Typography>,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Área (m²)"
                  name="area"
                  type="number"
                  value={formData.area}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Tipo de Negócio</InputLabel>
                  <Select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                    label="Tipo de Negócio"
                  >
                    <MenuItem value="venda">Venda</MenuItem>
                    <MenuItem value="aluguel">Aluguel</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Tipo de Imóvel</InputLabel>
                  <Select
                    name="tipoImovel"
                    value={formData.tipoImovel}
                    onChange={handleChange}
                    label="Tipo de Imóvel"
                  >
                    <MenuItem value="casa">Casa</MenuItem>
                    <MenuItem value="apartamento">Apartamento</MenuItem>
                    <MenuItem value="terreno">Terreno</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Estado do Imóvel</InputLabel>
                  <Select
                    name="estadoImovel"
                    value={formData.estadoImovel}
                    onChange={handleChange}
                    label="Estado do Imóvel"
                  >
                    <MenuItem value="novo">Novo</MenuItem>
                    <MenuItem value="semi-novo">Semi-novo</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Aceita Financiamento</InputLabel>
                  <Select
                    name="aceitaFinanciamento"
                    value={formData.aceitaFinanciamento ? "true" : "false"}
                    onChange={handleChange}
                    label="Aceita Financiamento"
                  >
                    <MenuItem value="true">Sim</MenuItem>
                    <MenuItem value="false">Não</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Endereço"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Cidade"
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Quartos"
                  name="quartos"
                  type="number"
                  value={formData.quartos}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Banheiros"
                  name="banheiros"
                  type="number"
                  value={formData.banheiros}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Vagas de Garagem"
                  name="vagasGaragem"
                  type="number"
                  value={formData.vagasGaragem}
                  onChange={handleChange}
                />
              </Grid>

              {id && formData.fotosExistentes.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Imagens Existentes
                  </Typography>
                  <ImageList cols={3} rowHeight={200}>
                    {formData.fotosExistentes.map((foto) => (
                      <ImageListItem key={foto}>
                        <img
                          src={`http://localhost:3001/uploads/${foto}`}
                          alt={foto}
                          loading="lazy"
                        />
                        <ImageListItemBar
                          position="top"
                          actionIcon={
                            <IconButton
                              sx={{ color: 'white' }}
                              onClick={() => handleDeleteImage(foto)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          }
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                </Grid>
              )}

              {formData.fotos.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Novas Imagens
                  </Typography>
                  <ImageList cols={3} rowHeight={200}>
                    {formData.fotos.map((file, index) => (
                      <ImageListItem key={index}>
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Nova imagem ${index + 1}`}
                          loading="lazy"
                        />
                        <ImageListItemBar
                          position="top"
                          actionIcon={
                            <IconButton
                              sx={{ color: 'white' }}
                              onClick={() => handleDeleteNewImage(index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          }
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                </Grid>
              )}

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  component="label"
                  fullWidth
                >
                  Adicionar Imagens
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Button>
                {formData.fotos.length > 0 && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {formData.fotos.length} nova(s) imagem(ns) selecionada(s)
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
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
                    {id ? 'Atualizar' : 'Criar'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ImovelForm; 