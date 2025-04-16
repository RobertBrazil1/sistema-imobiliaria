import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImoveisModule } from './imoveis/imoveis.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { getDatabaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),
    ImoveisModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {} 