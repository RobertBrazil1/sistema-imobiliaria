import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
      useFactory: () => databaseConfig,
      inject: [ConfigService],
    }),
    MulterModule.register(multerConfig),
    ImoveisModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {} 