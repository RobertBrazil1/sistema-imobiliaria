import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, UseInterceptors, UploadedFiles, BadRequestException, Put, NotFoundException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ImoveisService } from './imoveis.service';
import { Imovel } from './entities/imovel.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateImovelDto } from './dto/create-imovel.dto';
import { UpdateImovelDto } from './dto/update-imovel.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('imoveis')
@Controller('imoveis')
export class ImoveisController {
  constructor(private readonly imoveisService: ImoveisService) {}

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
      // Se não houver arquivos, inicializa fotos como array vazio
      if (!files) {
        updateImovelDto.fotos = [];
      }
      return await this.imoveisService.update(id, updateImovelDto, files);
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
} 