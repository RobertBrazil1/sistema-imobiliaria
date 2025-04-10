export interface Imovel {
  id: number;
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