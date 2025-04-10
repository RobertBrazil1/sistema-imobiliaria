import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Chip,
  IconButton,
  SelectChangeEvent,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';

interface Imovel {
  id: string;
  titulo: string;
  descricao: string;
  valor: number;
  tipo: string;
  tipoImovel: string;
  estadoImovel: string;
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

const Input = styled('input')({
  display: 'none',
});

export default function EditarImovel() {
  const navigate = useNavigate();
  const location = useLocation();
  const { imovel, fotosExistentes } = location.state || {};
  
  const [formData, setFormData] = useState<Imovel>({
    id: '',
    titulo: '',
    descricao: '',
    valor: 0,
    tipo: '',
    tipoImovel: '',
    estadoImovel: '',
    aceitaFinanciamento: false,
    fotos: [],
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    area: 0,
    quartos: 0,
    banheiros: 0,
    vagasGaragem: 0,
  });

  const [fotos, setFotos] = useState<File[]>([]);
  const [fotosExistentesState, setFotosExistentesState] = useState<string[]>([]);

  useEffect(() => {
    if (imovel) {
      setFormData(imovel);
      setFotosExistentesState(fotosExistentes || []);
    }
  }, [imovel, fotosExistentes]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFotos(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFoto = (index: number) => {
    setFotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveFotoExistente = (index: number) => {
    setFotosExistentesState(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.id) {
      console.error('ID do imóvel não encontrado');
      return;
    }

    const formDataToSend = new FormData();
    
    // Adicionar todos os campos do formulário
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'fotos' && key !== 'id') {
        formDataToSend.append(key, String(value));
      }
    });

    // Adicionar as fotos existentes na ordem correta
    fotosExistentesState.forEach((foto, index) => {
      formDataToSend.append(`fotosExistentes[${index}]`, foto);
    });

    // Adicionar novas fotos
    fotos.forEach(file => {
      formDataToSend.append('fotos', file);
    });

    console.log('Enviando dados:', {
      id: formData.id,
      fotosExistentes: fotosExistentesState,
      novasFotos: fotos.length
    });

    try {
      const response = await fetch(`http://localhost:3001/imoveis/${formData.id}`, {
        method: 'PUT',
        body: formDataToSend,
      });

      console.log('Resposta do servidor:', response.status);

      if (response.ok) {
        navigate('/imoveis');
      } else {
        const errorData = await response.json();
        console.error('Erro ao atualizar imóvel:', errorData);
        alert(`Erro ao atualizar imóvel: ${errorData.message || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao atualizar imóvel. Por favor, tente novamente.');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Editar Imóvel
        </Typography>

        <form onSubmit={handleSubmit}>
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
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="venda">Venda</MenuItem>
                  <MenuItem value="aluguel">Aluguel</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Imóvel</InputLabel>
                <Select
                  name="tipoImovel"
                  value={formData.tipoImovel}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="casa">Casa</MenuItem>
                  <MenuItem value="apartamento">Apartamento</MenuItem>
                  <MenuItem value="terreno">Terreno</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Estado do Imóvel</InputLabel>
                <Select
                  name="estadoImovel"
                  value={formData.estadoImovel}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="novo">Novo</MenuItem>
                  <MenuItem value="usado">Usado</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="aceitaFinanciamento"
                    checked={formData.aceitaFinanciamento}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      aceitaFinanciamento: e.target.checked,
                    }))}
                  />
                }
                label="Aceita Financiamento"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Fotos Existentes
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {fotosExistentesState.map((foto, index) => (
                  <Box key={index} sx={{ position: 'relative' }}>
                    <img
                      src={`http://localhost:3001/uploads/${foto}`}
                      alt={`Foto ${index + 1}`}
                      style={{ width: 100, height: 100, objectFit: 'cover' }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveFotoExistente(index)}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Adicionar Novas Fotos
              </Typography>
              <label htmlFor="fotos">
                <Input
                  accept="image/*"
                  id="fotos"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                />
                <Button variant="contained" component="span">
                  Selecionar Fotos
                </Button>
              </label>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                {fotos.map((foto, index) => (
                  <Box key={index} sx={{ position: 'relative' }}>
                    <img
                      src={URL.createObjectURL(foto)}
                      alt={`Preview ${index + 1}`}
                      style={{ width: 100, height: 100, objectFit: 'cover' }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveFoto(index)}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
              </Box>
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

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Cidade"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={4}>
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
                label="CEP"
                name="cep"
                value={formData.cep}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Área (m²)"
                name="area"
                type="number"
                value={formData.area}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Quartos"
                name="quartos"
                type="number"
                value={formData.quartos}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Banheiros"
                name="banheiros"
                type="number"
                value={formData.banheiros}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Vagas de Garagem"
                name="vagasGaragem"
                type="number"
                value={formData.vagasGaragem}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
              >
                Salvar Alterações
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
} 