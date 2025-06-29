# Clean Architecture com Inversion of Control e Dependency Injection

## 🏗️ Visão Geral

Este projeto implementa os princípios da **Clean Architecture** com foco em **Inversion of Control (IoC)**, **Dependency Injection (DI)** e **Dependency Inversion Principle (DIP)**. A estrutura foi organizada para maximizar a testabilidade, manutenibilidade e flexibilidade do código.

## 📁 Estrutura de Interfaces

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

## 🔄 Princípios Implementados

### 1. **Dependency Inversion Principle (DIP)**
- **Módulos de alto nível** não dependem de módulos de baixo nível
- **Ambos dependem de abstrações**
- **Abstrações não dependem de detalhes**

```typescript
// ❌ Antes (dependência direta)
export class RegisterUser {
  constructor(private usersRepository: PrismaUsersRepository) {}
}

// ✅ Depois (dependência de abstração)
export class RegisterUser implements IRegisterUserUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private authService: IAuthService
  ) {}
}
```

### 2. **Inversion of Control (IoC)**
- **Controle de dependências** é invertido
- **Container gerencia** o ciclo de vida dos objetos
- **Classes não criam** suas próprias dependências

```typescript
// Container gerencia todas as dependências
const container = new Container();

// Resolução automática de dependências
const authController = container.resolve<IAuthController>('IAuthController');
```

### 3. **Dependency Injection (DI)**
- **Dependências são injetadas** via construtor
- **Facilita testes** com mocks
- **Reduz acoplamento** entre classes

```typescript
// Injeção via construtor
export class AuthController implements IAuthController {
  constructor(
    private registerUser: IRegisterUserUseCase,
    private loginUser: ILoginUserUseCase,
    private refreshToken: IRefreshTokenUseCase
  ) {}
}
```

## 🏛️ Arquitetura em Camadas

### **Camada de Apresentação (Presentation Layer)**
```
Controllers → Use Cases → Services → Repositories
```

- **Controllers**: Lidam apenas com HTTP
- **Interfaces**: Definem contratos claros
- **Factories**: Criam instâncias quando necessário

### **Camada de Aplicação (Application Layer)**
```
Use Cases → Business Logic → Domain Entities
```

- **Use Cases**: Encapsulam regras de negócio
- **Services**: Funcionalidades compartilhadas
- **Entities**: Representam o domínio

### **Camada de Infraestrutura (Infrastructure Layer)**
```
Repositories → Database → External Services
```

- **Repositories**: Acessam dados
- **Prisma**: ORM para PostgreSQL
- **External Services**: APIs externas

## 🔧 Container de Injeção de Dependência

### **Container.ts**
```typescript
export class Container implements IContainer {
  private readonly services: Map<string, Constructor<any>> = new Map();
  private readonly instances: Map<string, any> = new Map();
  private readonly factories: Map<string, DependencyResolver<any>> = new Map();

  // Registra implementações
  register<T>(token: string, implementation: Constructor<T>): void

  // Registra factories
  registerFactory<T>(token: string, factory: DependencyResolver<T>): void

  // Resolve dependências
  resolve<T>(token: string): T

  // Verifica se existe
  has(token: string): boolean
}
```

### **Registro Automático de Serviços**
```typescript
private registerDefaultServices(): void {
  // Repositories
  this.register('IUsersRepository', PrismaUsersRepository);

  // Services com dependências
  this.registerFactory('IAuthService', () => {
    const usersRepository = this.resolve<IUsersRepository>('IUsersRepository');
    return new AuthService(usersRepository);
  });

  // Use Cases com dependências
  this.registerFactory('IRegisterUserUseCase', () => {
    const usersRepository = this.resolve<IUsersRepository>('IUsersRepository');
    const authService = this.resolve<IAuthService>('IAuthService');
    return new RegisterUser(usersRepository, authService);
  });
}
```

## 🧪 Benefícios para Testes

### **Testabilidade Melhorada**
```typescript
// Mock fácil de dependências
const mockRepository = {
  findByEmail: jest.fn(),
  create: jest.fn()
} as jest.Mocked<IUsersRepository>;

const mockAuthService = {
  generateAccessToken: jest.fn(),
  generateRefreshToken: jest.fn()
} as jest.Mocked<IAuthService>;

// Teste isolado
const useCase = new RegisterUser(mockRepository, mockAuthService);
```

### **Injeção de Mocks**
```typescript
// Container de teste
const testContainer = new Container();
testContainer.register('IUsersRepository', MockUsersRepository);
testContainer.register('IAuthService', MockAuthService);

// Resolução automática com mocks
const authController = testContainer.resolve<IAuthController>('IAuthController');
```

## 🔄 Fluxo de Dependências

### **Registro de Dependências**
```
1. Container é criado
2. Serviços são registrados automaticamente
3. Factories são configuradas
4. Dependências são resolvidas sob demanda
```

### **Resolução de Dependências**
```
Container.resolve('IAuthController')
  ↓
Resolve IRegisterUserUseCase
  ↓
Resolve IUsersRepository (PrismaUsersRepository)
Resolve IAuthService (AuthService)
  ↓
Cria RegisterUser com dependências injetadas
  ↓
Retorna AuthController com use cases injetados
```

## 📋 Interfaces Implementadas

### **Repositories**
```typescript
export interface IUsersRepository {
  create(user: User): Promise<void>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(user: User): Promise<void>;
  delete(id: string): Promise<void>;
  list(): Promise<User[]>;
  findByDepartment(department: string): Promise<User[]>;
}
```

### **Use Cases**
```typescript
export interface IRegisterUserUseCase {
  execute(request: RegisterUserRequest): Promise<RegisterUserResponse>;
}

export interface ILoginUserUseCase {
  execute(request: LoginUserRequest): Promise<LoginUserResponse>;
}
```

### **Services**
```typescript
export interface IAuthService {
  login(email: string, password: string): Promise<AuthResponse>;
  refreshToken(refreshToken: string): Promise<{ accessToken: string }>;
  verifyToken(token: string): TokenPayload;
  generateAccessToken(user: User): string;
  generateRefreshToken(user: User): string;
}
```

### **Controllers**
```typescript
export interface IAuthController {
  register(req: Request, res: Response): Promise<void>;
  login(req: Request, res: Response): Promise<void>;
  refreshToken(req: Request, res: Response): Promise<void>;
}
```

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

## 🔧 Como Adicionar Novos Serviços

### **1. Criar Interface**
```typescript
// src/interfaces/services/INewService.ts
export interface INewService {
  doSomething(): Promise<void>;
}
```

### **2. Implementar Serviço**
```typescript
// src/services/NewService.ts
export class NewService implements INewService {
  constructor(private dependency: IDependency) {}
  
  async doSomething(): Promise<void> {
    // Implementação
  }
}
```

### **3. Registrar no Container**
```typescript
// src/di/Container.ts
private registerDefaultServices(): void {
  // ... outros registros
  
  this.registerFactory('INewService', () => {
    const dependency = this.resolve<IDependency>('IDependency');
    return new NewService(dependency);
  });
}
```

### **4. Usar no Código**
```typescript
// Em qualquer lugar da aplicação
const newService = container.resolve<INewService>('INewService');
await newService.doSomething();
```

## 🚀 Próximos Passos

1. **Implementar validação** com decorators
2. **Adicionar logs** estruturados
3. **Implementar cache** com interfaces
4. **Criar testes** unitários completos
5. **Adicionar métricas** e monitoramento
6. **Implementar rate limiting** com interfaces

Esta arquitetura garante que o código seja **testável**, **manutenível** e **escalável**, seguindo os princípios da Clean Architecture! 🎉 