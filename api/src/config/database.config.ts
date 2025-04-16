import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
  const dbPort = parseInt(configService.get<string>('DB_PORT'), 10);
  
  console.log('Configurando banco de dados...');
  console.log('Host:', configService.get<string>('DB_HOST'));
  console.log('Port:', dbPort);
  console.log('Database:', configService.get<string>('DB_DATABASE'));
  console.log('Username:', configService.get<string>('DB_USERNAME'));
  console.log('Environment:', configService.get<string>('NODE_ENV'));

  const config: TypeOrmModuleOptions = {
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: dbPort,
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_DATABASE'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: configService.get<string>('NODE_ENV') === 'development',
    logging: true,
    retryAttempts: 5,
    retryDelay: 3000,
  };

  return config;
}; 