import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, UseInterceptors, UploadedFiles, BadRequestException, Put, NotFoundException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ImoveisService } from './imoveis.service';
import { Imovel } from './entities/imovel.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateImovelDto } from './dto/create-imovel.dto';
import { UpdateImovelDto } from './dto/update-imovel.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

@ApiTags('imoveis')
@Controller('imoveis')
export class ImoveisController {
  constructor(private readonly imoveisService: ImoveisService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os imóveis' })
  @ApiResponse({ status: 200, description: 'Lista de imóveis retornada com sucesso' })
  async findAll() {
    try {
      return await this.imoveisService.findAll();
    } catch (error) {
      throw new HttpException('Erro ao listar imóveis', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('dashboard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Obter dados para o dashboard' })
  @ApiResponse({ status: 200, description: 'Dados do dashboard retornados com sucesso' })
  async getDashboardData() {
    try {
      console.log('Iniciando busca de dados para o dashboard...');
      
      const imoveis = await this.imoveisService.findAll();
      console.log(`Total de imóveis encontrados para dashboard: ${imoveis.length}`);

      if (!imoveis || imoveis.length === 0) {
        console.log('Nenhum imóvel encontrado, retornando dados vazios');
        return {
          tiposImoveis: [],
          valoresMedios: [],
          statusImoveis: []
        };
      }

      // Processar dados para gráficos
      const tiposImoveis = imoveis.reduce((acc, imovel) => {
        const tipo = imovel.tipoImovel || 'Não especificado';
        acc[tipo] = (acc[tipo] || 0) + 1;
        return acc;
      }, {});

      const valoresMedios = imoveis.reduce((acc, imovel) => {
        const tipo = imovel.tipoImovel || 'Não especificado';
        if (!acc[tipo]) {
          acc[tipo] = { total: 0, count: 0 };
        }
        if (imovel.valor) {
          acc[tipo].total += Number(imovel.valor);
          acc[tipo].count += 1;
        }
        return acc;
      }, {} as Record<string, { total: number; count: number }>);

      const statusImoveis = imoveis.reduce((acc, imovel) => {
        const status = imovel.tipo || 'Não especificado';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      // Formatar dados para resposta
      const response = {
        tiposImoveis: Object.entries(tiposImoveis).map(([tipo, quantidade]) => ({
          tipo,
          quantidade
        })),
        valoresMedios: Object.entries(valoresMedios).map(([tipo, { total, count }]) => ({
          tipo,
          valorMedio: count > 0 ? Math.round(total / count) : 0
        })),
        statusImoveis: Object.entries(statusImoveis).map(([status, quantidade]) => ({
          status,
          quantidade
        }))
      };

      console.log('Dados do dashboard processados:', JSON.stringify(response, null, 2));
      return response;

    } catch (error) {
      console.error('Erro ao processar dados do dashboard:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erro ao processar dados do dashboard',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um imóvel por ID' })
  @ApiResponse({ status: 200, description: 'Imóvel encontrado com sucesso' })
  @ApiResponse({ status: 404, description: 'Imóvel não encontrado' })
  async findOne(@Param('id') id: string) {
    try {
      return await this.imoveisService.findOne(id);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new HttpException('Erro ao buscar imóvel', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  @UseInterceptors(FilesInterceptor('fotos', 10, {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Apenas arquivos de imagem são permitidos!'), false);
      }
      cb(null, true);
    },
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  }))
  @ApiOperation({ summary: 'Criar um novo imóvel' })
  @ApiResponse({ status: 201, description: 'Imóvel criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async create(
    @Body() createImovelDto: CreateImovelDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try {
      // Garantir que o campo fotos seja um array vazio se não houver arquivos
      if (!createImovelDto.fotos) {
        createImovelDto.fotos = [];
      }
      return await this.imoveisService.create(createImovelDto, files || []);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new HttpException('Erro ao criar imóvel', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  @UseInterceptors(FilesInterceptor('fotos', 10, {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Apenas arquivos de imagem são permitidos!'), false);
      }
      cb(null, true);
    },
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  }))
  @ApiOperation({ summary: 'Atualizar um imóvel' })
  @ApiResponse({ status: 200, description: 'Imóvel atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Imóvel não encontrado' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async update(
    @Param('id') id: string,
    @Body() updateImovelDto: UpdateImovelDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try {
      // Não inicializa fotos como array vazio para manter as existentes
      return await this.imoveisService.update(id, updateImovelDto, files || []);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException('Erro ao atualizar imóvel', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um imóvel' })
  @ApiResponse({ status: 200, description: 'Imóvel removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Imóvel não encontrado' })
  async remove(@Param('id') id: string) {
    try {
      await this.imoveisService.remove(id);
      return { message: 'Imóvel removido com sucesso' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new HttpException('Erro ao remover imóvel', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id/fotos/:foto')
  @ApiOperation({ summary: 'Remover uma foto do imóvel' })
  @ApiResponse({ status: 200, description: 'Foto removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Imóvel ou foto não encontrada' })
  async removeFoto(
    @Param('id') id: string,
    @Param('foto') foto: string,
  ) {
    try {
      const imovel = await this.imoveisService.findOne(id);
      
      // Remove a foto do array de fotos
      imovel.fotos = imovel.fotos.filter(f => f !== foto);
      
      // Salva o imóvel atualizado
      await this.imoveisService.update(id, { fotos: imovel.fotos }, []);
      
      // Remove o arquivo físico
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(__dirname, '..', '..', 'uploads', foto);
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      return { message: 'Foto removida com sucesso' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException('Erro ao remover foto', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
} 