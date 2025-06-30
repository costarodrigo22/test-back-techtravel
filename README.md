# Sistema de Gestão de Viagens Corporativas - Backend

Sistema de autenticação com JWT e refresh tokens para gestão de viagens corporativas, seguindo os princípios da Clean Architecture com Inversion of Control e Dependency Injection.

## 🚀 Tecnologias

- **Node.js** com TypeScript
- **Express.js** para APIs REST
- **Prisma** como ORM
- **PostgreSQL** como banco de dados
- **JWT** para autenticação
- **bcryptjs** para hash de senhas
- **Docker** para containerização
- **Clean Architecture** com IoC e DI

## 📋 Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- npm ou yarn

## 🏗️ Arquitetura

O projeto segue os princípios da **Clean Architecture** com **Inversion of Control (IoC)** e **Dependency Injection (DI)**:

```
src/
├── controllers/          # Controllers das APIs (HTTP)
├── di/                   # Container de injeção de dependência
├── entities/             # Entidades do domínio
├── factories/            # Factories para criação de objetos
├── interfaces/           # Contratos e abstrações
│   ├── container/        # Interface do container
│   ├── controllers/      # Interfaces dos controllers
│   ├── repositories/     # Interfaces dos repositórios
│   ├── routes/           # Interfaces das rotas
│   ├── services/         # Interfaces dos serviços
│   └── useCases/         # Interfaces dos casos de uso
├── middleware/           # Middlewares (auth, etc.)
├── repository/           # Implementações dos repositórios
├── services/             # Serviços compartilhados
├── useCases/             # Casos de uso (lógica de negócio)
│   ├── auth/            # Casos de uso de autenticação
│   └── user/            # Casos de uso de usuário
└── app.ts               # Aplicação principal
```

### 📁 Interfaces Organizadas

```
src/interfaces/
├── container/              # Container de injeção de dependência
│   └── IContainer.ts      # Interface do container
├── controllers/            # Contratos dos controllers
│   ├── IAuthController.ts # Interface do controller de auth
│   └── IUserController.ts # Interface do controller de usuário
├── repositories/           # Contratos dos repositórios
│   └── IUsersRepository.ts # Interface do repositório de usuários
├── routes/                 # Contratos das rotas
│   └── IRouteFactory.ts   # Interface da factory de rotas
├── services/               # Contratos dos serviços
│   └── IAuthService.ts    # Interface do serviço de auth
└── useCases/               # Contratos dos casos de uso
    ├── auth/              # Casos de uso de autenticação
    │   ├── IRegisterUserUseCase.ts
    │   ├── ILoginUserUseCase.ts
    │   └── IRefreshTokenUseCase.ts
    └── user/              # Casos de uso de usuário
        └── IGetUserProfileUseCase.ts
```

### 📁 Casos de Uso Implementados

- **RegisterUser** - Cadastro de usuário
- **LoginUser** - Login de usuário
- **RefreshToken** - Renovação de token
- **GetUserProfile** - Obter perfil do usuário

## 🔄 Princípios Implementados

### **1. Dependency Inversion Principle (DIP)**
- Módulos de alto nível não dependem de módulos de baixo nível
- Ambos dependem de abstrações
- Abstrações não dependem de detalhes

### **2. Inversion of Control (IoC)**
- Controle de dependências é invertido
- Container gerencia o ciclo de vida dos objetos
- Classes não criam suas próprias dependências

### **3. Dependency Injection (DI)**
- Dependências são injetadas via construtor
- Facilita testes com mocks
- Reduz acoplamento entre classes

## 🛠️ Instalação e Configuração

### 1. Clone o repositório
```bash
git clone <repository-url>
cd setup-back
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
O arquivo `.env` já está configurado com valores padrão para desenvolvimento.

### 4. Inicie o banco de dados com Docker
```bash
npm run docker:up
```

### 5. Execute as migrações do Prisma
```bash
npm run prisma:migrate
```

### 6. Gere o cliente Prisma
```bash
npm run prisma:generate
```

### 7. Inicie a aplicação
```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

## 🐳 Docker

### Subir todos os serviços
```bash
npm run docker:up
```

### Parar todos os serviços
```bash
npm run docker:down
```

### Rebuild das imagens
```bash
npm run docker:build
```

## 📚 APIs

### Autenticação

#### POST /auth/register
Cadastrar novo usuário.

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@empresa.com",
  "password": "senha123",
  "gender": "MALE"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@empresa.com"
  },
  "accessToken": "jwt_token",
  "refreshToken": "refresh_token"
}
```

**Validações:**
- Nome deve ter pelo menos 2 caracteres
- Email deve ser válido
- Senha deve ter pelo menos 6 caracteres
- Gênero deve ser válido (MALE, FEMALE, OTHER)
- Email não pode estar em uso

#### POST /auth/login
Fazer login.

**Body:**
```json
{
  "email": "joao@empresa.com",
  "password": "senha123"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@empresa.com",
    "role": "EMPLOYEE"
  },
  "accessToken": "jwt_token",
  "refreshToken": "refresh_token"
}
```

#### POST /auth/refresh
Renovar access token.

**Body:**
```json
{
  "refreshToken": "refresh_token"
}
```

**Response:**
```json
{
  "accessToken": "new_jwt_token"
}
```

### Usuários (Rotas Privadas)

#### GET /users/profile
Obter perfil do usuário autenticado.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "id": "uuid",
  "name": "João Silva",
  "email": "joao@empresa.com",
  "gender": "MALE",
  "role": "EMPLOYEE",
  "department": "TI",
  "employeeId": "EMP001",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Health Check

#### GET /health
Verificar status da aplicação.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🔐 Autenticação

O sistema usa JWT (JSON Web Tokens) para autenticação:

- **Access Token**: Expira em 15 minutos
- **Refresh Token**: Expira em 7 dias
- **Header**: `Authorization: Bearer <token>`

## 🗄️ Banco de Dados

### Modelo User
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  gender Gender NOT NULL,
  role Role DEFAULT 'EMPLOYEE',
  department VARCHAR,
  employeeId VARCHAR,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

### Enums
```sql
CREATE TYPE Gender AS ENUM ('MALE', 'FEMALE', 'OTHER');
CREATE TYPE Role AS ENUM ('EMPLOYEE', 'MANAGER', 'ADMIN');
```

## 🧪 Testando as APIs

### 1. Cadastrar usuário
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@empresa.com",
    "password": "senha123",
    "gender": "MALE"
  }'
```

### 2. Fazer login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@empresa.com",
    "password": "senha123"
  }'
```

### 3. Acessar rota privada
```bash
curl -X GET http://localhost:3000/users/profile \
  -H "Authorization: Bearer <access_token>"
```

## 🏛️ Casos de Uso

### O que são Casos de Uso?

Casos de uso encapsulam a lógica de negócio específica da aplicação:

- ✅ **Encapsulam a lógica de negócio**
- ✅ **Definem contratos claros** (Request/Response)
- ✅ **São independentes de frameworks**
- ✅ **São facilmente testáveis**
- ✅ **Seguem o princípio de responsabilidade única**

### Fluxo de Dados
```
Controller → Use Case → Repository → Database
    ↑           ↑           ↑
Response ← Response ← Entity ← Prisma
```

### Benefícios
- **Separação de responsabilidades**
- **Testabilidade**
- **Reutilização**
- **Manutenibilidade**

## 🔧 Container de Injeção de Dependência

### Características
- **Registro automático** de serviços
- **Resolução de dependências** sob demanda
- **Factories** para criação complexa
- **Singleton** por padrão
- **Tipagem forte** com TypeScript

### Exemplo de Uso
```typescript
// Container gerencia todas as dependências
const container = new Container();

// Resolução automática
const authController = container.resolve<IAuthController>('IAuthController');
const userController = container.resolve<IUserController>('IUserController');
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Iniciar em modo desenvolvimento
- `npm run build` - Compilar TypeScript
- `npm start` - Iniciar em produção
- `npm run prisma:generate` - Gerar cliente Prisma
- `npm run prisma:migrate` - Executar migrações
- `npm run prisma:studio` - Abrir Prisma Studio
- `npm run docker:up` - Subir containers
- `npm run docker:down` - Parar containers

## 🚨 Segurança

- Senhas são hasheadas com bcrypt
- JWT tokens com expiração
- Refresh tokens para renovação segura
- Validação de entrada em todos os casos de uso
- CORS configurado

## 🎯 Vantagens da Arquitetura

### **1. Flexibilidade**
- Fácil troca de implementações
- Configuração por ambiente
- Plugins e extensões

### **2. Testabilidade**
- Mocks simples de criar
- Testes isolados
- Cobertura completa

### **3. Manutenibilidade**
- Código organizado
- Responsabilidades claras
- Fácil de entender

### **4. Escalabilidade**
- Novos módulos fáceis de adicionar
- Dependências gerenciadas
- Arquitetura consistente

## 📝 Próximos Passos

1. **Implementar validação** com decorators
2. **Adicionar logs** estruturados
3. **Implementar cache** com interfaces
4. **Criar testes** unitários completos
5. **Adicionar métricas** e monitoramento
6. **Implementar rate limiting** com interfaces
7. **Implementar as entidades** de voos e reservas
8. **Criar casos de uso** para gestão de voos e reservas

## 📚 Documentação Adicional

- [Modelagem do Banco de Dados](./DATABASE_MODELING.md)
- [Arquitetura de Casos de Uso](./USE_CASES_ARCHITECTURE.md)
- [Clean Architecture com IoC e DI](./CLEAN_ARCHITECTURE.md) 