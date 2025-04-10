import { Injectable, NotFoundException } from '@nestjs/common';
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
    return this.imovelRepository.find();
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

    // Combinar fotos existentes com novas fotos
    const fotosAtualizadas = [
      ...(updateImovelDto.fotos || []),
      ...novasFotos
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