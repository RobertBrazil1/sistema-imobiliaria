import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Imovel } from './entities/imovel.entity';
import { CreateImovelDto } from './dto/create-imovel.dto';
import { UpdateImovelDto } from './dto/update-imovel.dto';
import { Express } from 'express';

@Injectable()
export class ImoveisService {
  constructor(
    @InjectRepository(Imovel)
    private readonly imovelRepository: Repository<Imovel>,
  ) {}

  async create(createImovelDto: CreateImovelDto, files: Express.Multer.File[]): Promise<Imovel> {
    const fotos = files ? files.map(file => String(file.filename)) : [];
    
    const imovel = this.imovelRepository.create({
      ...createImovelDto,
      fotos: fotos
    });

    return this.imovelRepository.save(imovel);
  }

  async findAll(): Promise<Imovel[]> {
    try {
      console.log('Iniciando busca de imóveis...');
      
      if (!this.imovelRepository) {
        console.error('Repositório não inicializado');
        throw new HttpException('Repositório não inicializado', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      // Verificar conexão com o banco
      try {
        await this.imovelRepository.query('SELECT 1');
        console.log('Conexão com o banco de dados estabelecida com sucesso');
      } catch (error) {
        console.error('Erro ao conectar com o banco de dados:', {
          message: error.message,
          code: error.code,
          detail: error.detail
        });
        throw new HttpException(
          `Erro ao conectar com o banco de dados: ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      // Buscar todos os imóveis
      console.log('Buscando todos os imóveis...');
      const imoveis = await this.imovelRepository.find();
      
      console.log(`Total de imóveis encontrados: ${imoveis.length}`);
      
      if (imoveis.length > 0) {
        console.log('Primeiro imóvel encontrado:', {
          id: imoveis[0].id,
          titulo: imoveis[0].titulo,
          tipo: imoveis[0].tipo,
          tipoImovel: imoveis[0].tipoImovel,
          valor: imoveis[0].valor
        });
      } else {
        console.log('Nenhum imóvel encontrado no banco de dados');
      }

      return imoveis;
    } catch (error) {
      console.error('Erro detalhado ao buscar imóveis:', {
        message: error.message,
        code: error.code,
        detail: error.detail,
        stack: error.stack
      });
      
      if (error.code === 'ECONNREFUSED') {
        throw new HttpException(
          'Não foi possível conectar ao banco de dados. Verifique se o PostgreSQL está em execução.',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
      
      if (error.code === '28P01') {
        throw new HttpException(
          'Credenciais do banco de dados inválidas. Verifique o usuário e senha.',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      if (error.code === '3D000') {
        throw new HttpException(
          'Banco de dados não existe. Verifique o nome do banco.',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `Erro ao buscar imóveis: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findOne(id: string): Promise<Imovel> {
    const imovel = await this.imovelRepository.findOne({ where: { id } });
    if (!imovel) {
      throw new NotFoundException(`Imóvel com ID ${id} não encontrado`);
    }
    return imovel;
  }

  async update(id: string, updateImovelDto: UpdateImovelDto, files: Express.Multer.File[]) {
    const imovel = await this.imovelRepository.findOne({ where: { id } });
    if (!imovel) {
      throw new NotFoundException('Imóvel não encontrado');
    }

    // Mapear os arquivos para seus nomes
    const novasFotos = files ? files.map(file => file.filename) : [];

    // Manter as fotos existentes e adicionar as novas
    const fotosAtualizadas = [
      ...imovel.fotos, // Mantém as fotos existentes
      ...novasFotos    // Adiciona as novas fotos
    ];

    // Atualizar o DTO com as fotos combinadas
    const imovelAtualizado = {
      ...imovel,
      ...updateImovelDto,
      fotos: fotosAtualizadas
    };

    return this.imovelRepository.save(imovelAtualizado);
  }

  async remove(id: string): Promise<void> {
    const imovel = await this.findOne(id);
    await this.imovelRepository.remove(imovel);
  }
} 