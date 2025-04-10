import { DataSource } from 'typeorm';
import { Imovel } from '../imoveis/entities/imovel.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'rodney140',
  database: 'imobiliaria',
  synchronize: true,
  logging: true,
  entities: [Imovel],
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
}); 