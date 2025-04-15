import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { ImoveisModule } from './imoveis/imoveis.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { multerConfig } from './config/multer.config';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        console.log('Configurando banco de dados...');
        console.log('DB_HOST:', configService.get('DB_HOST'));
        console.log('DB_PORT:', configService.get('DB_PORT'));
        console.log('DB_USERNAME:', configService.get('DB_USERNAME'));
        console.log('DB_DATABASE:', configService.get('DB_DATABASE'));
        
        return {
          ...databaseConfig,
          host: configService.get('DB_HOST'),
          port: parseInt(configService.get('DB_PORT')),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
        } as TypeOrmModuleOptions;
      },
      inject: [ConfigService],
    }),
    MulterModule.register(multerConfig),
    ImoveisModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {} 