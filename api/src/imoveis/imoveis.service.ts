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

      const imoveis = await this.imovelRepository.find();
      console.log(`Total de imóveis encontrados: ${imoveis.length}`);
      
      if (imoveis.length > 0) {
        console.log('Primeiro imóvel encontrado:', JSON.stringify(imoveis[0], null, 2));
      } else {
        console.log('Nenhum imóvel encontrado');
      }

      return imoveis;
    } catch (error) {
      console.error('Erro detalhado ao buscar imóveis:', error);
      
      if (error.code === 'ECONNREFUSED') {
        throw new HttpException('Erro de conexão com o banco de dados', HttpStatus.INTERNAL_SERVER_ERROR);
      }
      
      if (error.code === '28P01') {
        throw new HttpException('Credenciais do banco de dados inválidas', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      throw new HttpException('Erro ao buscar imóvel', HttpStatus.INTERNAL_SERVER_ERROR);
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