# Sistema de Gerenciamento Imobiliário

Sistema completo para gerenciamento de imóveis, com interface administrativa e API RESTful.

## 🚀 Tecnologias Utilizadas

### Backend (API)
- NestJS
- TypeORM
- PostgreSQL
- JWT Authentication
- Multer (Upload de arquivos)
- Swagger (Documentação da API)

### Frontend (Admin)
- React
- TypeScript
- Material-UI
- React Router
- Axios

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- PostgreSQL
- npm ou yarn

## 🔧 Instalação

### 1. Clonar o repositório
```bash
git clone https://github.com/seu-usuario/nome-do-repositorio.git
cd nome-do-repositorio
```

### 2. Configurar o Banco de Dados
1. Criar um banco de dados PostgreSQL chamado "imobiliaria"
2. Configurar as credenciais no arquivo `.env` (na pasta `api`)

### 3. Instalar Dependências do Backend
```bash
cd api
npm install
```

### 4. Instalar Dependências do Frontend
```bash
cd admin
npm install
```

### 5. Configurar Variáveis de Ambiente
Na pasta `api`, crie um arquivo `.env` com o seguinte conteúdo:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=sua_senha
DB_DATABASE=imobiliaria
JWT_SECRET=sua_chave_secreta_jwt
```

## 🚀 Executando o Projeto

### Backend
```bash
cd api
npm run start:dev
```
A API estará disponível em `http://localhost:3001`

### Frontend
```bash
cd admin
npm start
```
O painel administrativo estará disponível em `http://localhost:3000`

## 📚 Documentação da API

A documentação da API está disponível em `http://localhost:3001/api` quando o servidor estiver rodando.

## 🔐 Autenticação

O sistema possui três níveis de acesso:
- SUPERUSER: Acesso total ao sistema
- ADMIN: Acesso administrativo
- USER: Acesso básico

### Criando um Superuser
```http
POST http://localhost:3001/users/superuser
Content-Type: application/json

{
  "username": "superadmin",
  "password": "sua_senha_segura",
  "nome": "Super Administrador",
  "email": "superadmin@exemplo.com"
}
```

## 📝 Funcionalidades

### Imóveis
- Cadastro de imóveis
- Upload de fotos
- Edição de informações
- Exclusão de imóveis
- Listagem com filtros

### Usuários
- Gerenciamento de usuários
- Controle de acesso baseado em roles
- Autenticação JWT

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## ✨ Autor

- Robert Brazil - Desenvolvedor full-stack 