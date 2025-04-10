import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));
  
  // Configurar CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:5173'], // URLs do frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  // Configurar limite de tamanho do payload
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Servir arquivos estáticos
  app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

  // Configurar timeouts
  app.use((req, res, next) => {
    req.setTimeout(5000);
    res.setTimeout(5000);
    next();
  });

  const config = new DocumentBuilder()
    .setTitle('API Imobiliária')
    .setDescription('API para sistema de imobiliária')
    .setVersion('1.0')
    .addTag('imoveis')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3001);
}
bootstrap(); 