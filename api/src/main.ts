import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar pipes globais
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: false,
    disableErrorMessages: false,
  }));
  
  // Configurar CORS
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1'
  ];

  console.log('Configurando CORS com as seguintes origens permitidas:', allowedOrigins);
  
  app.enableCors({
    origin: function(origin, callback) {
      console.log('Recebida requisição de origem:', origin);
      if (!origin || allowedOrigins.includes(origin)) {
        console.log('Origem permitida:', origin);
        callback(null, true);
      } else {
        console.log('Origem bloqueada:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
      'Access-Control-Allow-Origin'
    ],
    exposedHeaders: ['Authorization'],
    maxAge: 3600
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

  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('API Imobiliária')
    .setDescription('API para sistema de imobiliária')
    .setVersion('1.0')
    .addTag('imoveis')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Iniciar servidor
  const port = 3001;
  await app.listen(port);
  console.log(`Servidor iniciado na porta ${port}`);
  console.log(`Documentação Swagger disponível em http://localhost:${port}/api`);
}
bootstrap(); 