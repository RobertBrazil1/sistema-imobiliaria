import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export type TipoImovel = 'casa' | 'apartamento' | 'terreno';
export type TipoNegocio = 'venda' | 'aluguel';
export type EstadoImovel = 'novo' | 'semi-novo';

@Entity('imovel')
export class Imovel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  titulo: string;

  @Column('text')
  descricao: string;

  @Column('decimal', { precision: 10, scale: 2 })
  valor: number;

  @Column({
    type: 'enum',
    enum: ['venda', 'aluguel'],
  })
  tipo: TipoNegocio;

  @Column({
    type: 'enum',
    enum: ['casa', 'apartamento', 'terreno'],
  })
  tipoImovel: TipoImovel;

  @Column({
    type: 'enum',
    enum: ['novo', 'semi-novo'],
  })
  estadoImovel: EstadoImovel;

  @Column({ default: false })
  aceitaFinanciamento: boolean;

  @Column('text', { array: true, default: [] })
  fotos: string[];

  @Column()
  endereco: string;

  @Column()
  cidade: string;

  @Column()
  estado: string;

  @Column('decimal', { precision: 10, scale: 2 })
  area: number;

  @Column('int')
  quartos: number;

  @Column('int')
  banheiros: number;

  @Column('int')
  vagasGaragem: number;
} 