# Clean Architecture com Inversion of Control e Dependency Injection

## 🏗️ Visão Geral

Este projeto implementa os princípios da **Clean Architecture** de Robert C. Martin com foco em **Inversion of Control (IoC)**, **Dependency Injection (DI)** e **Dependency Inversion Principle (DIP)**. A estrutura foi organizada para maximizar a testabilidade, manutenibilidade e flexibilidade do código.

## 📁 Estrutura de Interfaces

```
src/interfaces/
├── container/              # Container de injeção de dependência
│   └── IContainer.ts      # Interface do container
├── controllers/            # Contratos dos controllers
│   ├── IAuthController.ts # Interface do controller de auth
│   └── IUserController.ts # Interface do controller de usuário
├── repositories/           # Contratos dos repositórios
│   ├── IAirlinesRepository.ts
│   ├── IAirportsRepository.ts
│   ├── IBookingsRepository.ts
│   ├── IFlightsRepository.ts
│   ├── IItinerariesRepository.ts
│   └── IUsersRepository.ts
├── routes/                 # Contratos das rotas
│   └── IRouteFactory.ts   # Interface da factory de rotas
├── services/               # Contratos dos serviços
│   └── IAuthService.ts    # Interface do serviço de auth
└── useCases/               # Contratos dos casos de uso
    ├── airline/           # Casos de uso de companhias aéreas
    ├── airport/           # Casos de uso de aeroportos
    ├── auth/              # Casos de uso de autenticação
    ├── availability/      # Casos de uso de disponibilidade
    ├── booking/           # Casos de uso de reservas
    ├── flight/            # Casos de uso de voos
    ├── itinerary/         # Casos de uso de itinerários
    └── user/              # Casos de uso de usuário
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
  this.register('IFlightsRepository', PrismaFlightsRepository);
  this.register('IAirlinesRepository', PrismaAirlinesRepository);
  this.register('IAirportsRepository', PrismaAirportsRepository);
  this.register('IItinerariesRepository', PrismaItinerariesRepository);
  this.register('IBookingsRepository', PrismaBookingsRepository);

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

  // Use Cases - Flight
  this.registerFactory('CreateFlight', () => new CreateFlight(this.resolve('IFlightsRepository')));
  this.registerFactory('GetFlightById', () => new GetFlightById(this.resolve('IFlightsRepository')));
  this.registerFactory('UpdateFlight', () => new UpdateFlight(this.resolve('IFlightsRepository')));
  this.registerFactory('DeleteFlight', () => new DeleteFlight(this.resolve('IFlightsRepository')));
  this.registerFactory('ListFlights', () => new ListFlights(this.resolve('IFlightsRepository')));

  // Use Cases - Airline
  this.registerFactory('CreateAirline', () => new CreateAirline(this.resolve('IAirlinesRepository')));
  this.registerFactory('GetAirlineById', () => new GetAirlineById(this.resolve('IAirlinesRepository')));
  this.registerFactory('UpdateAirline', () => new UpdateAirline(this.resolve('IAirlinesRepository')));
  this.registerFactory('DeleteAirline', () => new DeleteAirline(this.resolve('IAirlinesRepository')));
  this.registerFactory('ListAirlines', () => new ListAirlines(this.resolve('IAirlinesRepository')));

  // Use Cases - Airport
  this.registerFactory('CreateAirport', () => new CreateAirport(this.resolve('IAirportsRepository')));
  this.registerFactory('GetAirportById', () => new GetAirportById(this.resolve('IAirportsRepository')));
  this.registerFactory('UpdateAirport', () => new UpdateAirport(this.resolve('IAirportsRepository')));
  this.registerFactory('DeleteAirport', () => new DeleteAirport(this.resolve('IAirportsRepository')));
  this.registerFactory('ListAirports', () => new ListAirports(this.resolve('IAirportsRepository')));

  // Use Cases - Itinerary
  this.registerFactory('ListItineraries', () => new ListItineraries(this.resolve('IItinerariesRepository')));
  this.registerFactory('CreateItinerary', () => new CreateItinerary(this.resolve('IItinerariesRepository'), this.resolve('IFlightsRepository')));
  this.registerFactory('GetItineraryById', () => new GetItineraryById(this.resolve('IItinerariesRepository')));
  this.registerFactory('DeleteItinerary', () => new DeleteItinerary(this.resolve('IItinerariesRepository')));

  // Use Cases - Availability
  this.registerFactory('SearchAvailability', () => new SearchAvailability(this.resolve('IItinerariesRepository')));

  // Use Cases - Booking
  this.registerFactory('CreateBooking', () => new CreateBooking(this.resolve('IBookingsRepository'), this.resolve('IUsersRepository'), this.resolve('IItinerariesRepository')));
  this.registerFactory('GetUserBookings', () => new GetUserBookings(this.resolve('IBookingsRepository'), this.resolve('IUsersRepository')));
  this.registerFactory('CancelBooking', () => new CancelBooking(this.resolve('IBookingsRepository')));
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
  ↓
Resolve IAuthService (AuthService)
  ↓
Instância criada e retornada
```

## 🏛️ Casos de Uso Implementados

### **Autenticação**
- **RegisterUser**: Cadastro de usuário com validações
- **LoginUser**: Autenticação com JWT
- **RefreshToken**: Renovação de tokens

### **Usuários**
- **GetUserProfile**: Obter perfil do usuário autenticado

### **Companhias Aéreas**
- **CreateAirline**: Criar companhia aérea
- **GetAirlineById**: Buscar companhia por ID
- **ListAirlines**: Listar todas as companhias
- **UpdateAirline**: Atualizar dados da companhia
- **DeleteAirline**: Remover companhia

### **Aeroportos**
- **CreateAirport**: Criar aeroporto
- **GetAirportById**: Buscar aeroporto por ID
- **ListAirports**: Listar todos os aeroportos
- **UpdateAirport**: Atualizar dados do aeroporto
- **DeleteAirport**: Remover aeroporto

### **Voos**
- **CreateFlight**: Criar voo com validações
- **GetFlightById**: Buscar voo por ID
- **ListFlights**: Listar voos com filtros
- **UpdateFlight**: Atualizar dados do voo
- **DeleteFlight**: Remover voo

### **Itinerários**
- **CreateItinerary**: Criar itinerário composto por voos
- **GetItineraryById**: Buscar itinerário por ID
- **ListItineraries**: Listar itinerários
- **DeleteItinerary**: Remover itinerário

### **Disponibilidade**
- **SearchAvailability**: Buscar disponibilidade de voos com filtros

### **Reservas**
- **CreateBooking**: Criar reserva para usuário
- **GetUserBookings**: Listar reservas de um usuário
- **CancelBooking**: Cancelar reserva (soft delete)

## 🎯 Benefícios da Arquitetura

### **1. Separação de Responsabilidades**
- **Controllers**: Lidam apenas com HTTP
- **Use Cases**: Contêm a lógica de negócio
- **Repositories**: Acessam dados
- **Entities**: Representam o domínio

### **2. Testabilidade**
- Cada camada pode ser testada independentemente
- Mocks fáceis de criar
- Testes isolados e rápidos

### **3. Manutenibilidade**
- Código organizado e legível
- Responsabilidades claras
- Fácil de entender e modificar

### **4. Flexibilidade**
- Fácil troca de implementações
- Configuração por ambiente
- Plugins e extensões

### **5. Escalabilidade**
- Novos módulos fáceis de adicionar
- Dependências gerenciadas
- Arquitetura consistente

## 🔧 Como Adicionar Novos Casos de Uso

### **1. Criar a Interface**
```typescript
// interfaces/useCases/meuModulo/IMeuCasoDeUso.ts
export interface IMeuCasoDeUsoRequest {
  campo1: string;
  campo2: number;
}

export interface IMeuCasoDeUsoResponse {
  resultado: string;
}

export interface IMeuCasoDeUso {
  execute(request: IMeuCasoDeUsoRequest): Promise<IMeuCasoDeUsoResponse>;
}
```

### **2. Implementar o Caso de Uso**
```typescript
// useCases/meuModulo/MeuCasoDeUso.ts
export class MeuCasoDeUso implements IMeuCasoDeUso {
  constructor(
    private repository: IMeuRepository
  ) {}

  async execute(request: IMeuCasoDeUsoRequest): Promise<IMeuCasoDeUsoResponse> {
    // Lógica de negócio aqui
    return { resultado: 'sucesso' };
  }
}
```

### **3. Registrar no Container**
```typescript
// di/Container.ts
this.registerFactory('IMeuCasoDeUso', () => 
  new MeuCasoDeUso(this.resolve('IMeuRepository'))
);
```

### **4. Criar o Controller**
```typescript
// controllers/MeuController.ts
export class MeuController {
  constructor(
    private meuCasoDeUso: IMeuCasoDeUso
  ) {}

  async meuMetodo(req: Request, res: Response) {
    const result = await this.meuCasoDeUso.execute(req.body);
    return res.json(result);
  }
}
```

### **5. Adicionar as Rotas**
```typescript
// factories/RouteFactory.ts
createMeuRotas(controller: MeuController): Router {
  const router = Router();
  router.post('/meu-endpoint', (req, res) => controller.meuMetodo(req, res));
  return router;
}
```

## 📚 Conclusão

A implementação da Clean Architecture com IoC e DI neste projeto proporciona:

- **Código limpo e organizado**
- **Fácil manutenção e evolução**
- **Testabilidade excepcional**
- **Flexibilidade para mudanças**
- **Escalabilidade para crescimento**

Esta arquitetura permite que o sistema cresça de forma sustentável, mantendo a qualidade do código e facilitando a adição de novas funcionalidades. 
Esta arquitetura garante que o código seja **testável**, **manutenível** e **escalável**, seguindo os princípios da Clean Architecture! 🎉 