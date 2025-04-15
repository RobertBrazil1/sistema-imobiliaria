import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    console.log('[UsersService] Criando novo usuário:', createUserDto);
    const user = this.usersRepository.create(createUserDto);
    const savedUser = await this.usersRepository.save(user);
    console.log('[UsersService] Usuário criado com sucesso:', savedUser.id);
    return savedUser;
  }

  async findAll(): Promise<User[]> {
    console.log('[UsersService] Buscando todos os usuários');
    const users = await this.usersRepository.find();
    console.log('[UsersService] Usuários encontrados:', users.length);
    return users;
  }

  async findOne(id: string): Promise<User> {
    console.log('[UsersService] Buscando usuário por ID:', id);
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      console.log('[UsersService] Usuário não encontrado:', id);
      throw new NotFoundException('Usuário não encontrado');
    }
    console.log('[UsersService] Usuário encontrado:', user.id);
    return user;
  }

  async findByUsername(username: string): Promise<User | null> {
    console.log('[UsersService] Buscando usuário por username:', username);
    const user = await this.usersRepository.findOne({ where: { username } });
    console.log('[UsersService] Usuário encontrado:', user ? 'sim' : 'não');
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    console.log('[UsersService] Buscando usuário por email:', email);
    const user = await this.usersRepository.findOne({ where: { email } });
    console.log('[UsersService] Usuário encontrado:', user ? 'sim' : 'não');
    return user;
  }

  async remove(id: string): Promise<void> {
    console.log('[UsersService] Excluindo usuário:', id);
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      console.log('[UsersService] Usuário não encontrado para exclusão:', id);
      throw new NotFoundException('Usuário não encontrado');
    }
    console.log('[UsersService] Usuário excluído com sucesso');
  }
} 