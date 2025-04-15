import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserRole } from './entities/user.entity';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.SUPERUSER)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users' })
  async findAll(): Promise<User[]> {
    console.log('[UsersController] Buscando todos os usuários');
    const users = await this.usersService.findAll();
    console.log('[UsersController] Usuários encontrados:', users.length);
    return users;
  }

  @Post()
  @Roles(UserRole.SUPERUSER)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 409, description: 'Username already exists' })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    console.log('[UsersController] Criando novo usuário:', createUserDto);
    const user = await this.usersService.create(createUserDto);
    console.log('[UsersController] Usuário criado com sucesso:', user.id);
    return user;
  }

  @Post('superuser')
  @UseGuards()
  @ApiOperation({ summary: 'Create a new superuser' })
  @ApiResponse({ status: 201, description: 'Superuser created successfully' })
  @ApiResponse({ status: 409, description: 'Username already exists' })
  async createSuperuser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create({
      ...createUserDto,
      role: UserRole.SUPERUSER
    });
  }

  @Get(':id')
  @Roles(UserRole.SUPERUSER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get a user by id' })
  @ApiResponse({ status: 200, description: 'Return the user' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string): Promise<User> {
    console.log('[UsersController] Buscando usuário por ID:', id);
    const user = await this.usersService.findOne(id);
    console.log('[UsersController] Usuário encontrado:', user ? 'sim' : 'não');
    return user;
  }

  @Delete(':id')
  @Roles(UserRole.SUPERUSER)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id') id: string): Promise<void> {
    console.log('[UsersController] Excluindo usuário:', id);
    await this.usersService.remove(id);
    console.log('[UsersController] Usuário excluído com sucesso');
  }
} 