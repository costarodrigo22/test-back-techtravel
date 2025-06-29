# Arquitetura de Casos de Uso - Clean Architecture

## 🏗️ Visão Geral

Este projeto segue os princípios da **Clean Architecture** com foco em **Casos de Uso** (Use Cases). Os casos de uso encapsulam a lógica de negócio específica da aplicação, tornando o código mais organizado, testável e manutenível.

## 📁 Estrutura de Casos de Uso

```
src/useCases/
├── auth/                    # Casos de uso de autenticação
│   ├── RegisterUser.ts     # Cadastro de usuário
│   ├── LoginUser.ts        # Login de usuário
│   └── RefreshToken.ts     # Renovação de token
└── user/                    # Casos de uso de usuário
    └── GetUserProfile.ts   # Obter perfil do usuário
```

## 🎯 O que são Casos de Uso?

**Casos de Uso** são classes que implementam uma funcionalidade específica do sistema. Eles:

- ✅ **Encapsulam a lógica de negócio**
- ✅ **Definem contratos claros** (Request/Response)
- ✅ **São independentes de frameworks**
- ✅ **São facilmente testáveis**
- ✅ **Seguem o princípio de responsabilidade única**

## 🔄 Fluxo de Dados

```
Controller → Use Case → Repository → Database
    ↑           ↑           ↑
Response ← Response ← Entity ← Prisma
```

## 📋 Casos de Uso Implementados

### 1. RegisterUser
**Propósito**: Cadastrar um novo usuário no sistema

**Request**:
```typescript
{
  name: string;
  email: string;
  password: string;
  gender: string;
}
```

**Response**:
```typescript
{
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
}
```

**Validações**:
- Nome deve ter pelo menos 2 caracteres
- Email deve ser válido
- Senha deve ter pelo menos 6 caracteres
- Gênero deve ser válido
- Email não pode estar em uso

### 2. LoginUser
**Propósito**: Autenticar um usuário existente

**Request**:
```typescript
{
  email: string;
  password: string;
}
```

**Response**:
```typescript
{
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
}
```

**Validações**:
- Email deve ser válido
- Senha é obrigatória
- Credenciais devem ser válidas

### 3. RefreshToken
**Propósito**: Renovar o access token usando refresh token

**Request**:
```typescript
{
  refreshToken: string;
}
```

**Response**:
```typescript
{
  accessToken: string;
}
```

**Validações**:
- Refresh token é obrigatório
- Token deve ser válido
- Usuário deve existir

### 4. GetUserProfile
**Propósito**: Obter dados do perfil do usuário

**Request**:
```typescript
{
  userId: string;
}
```

**Response**:
```typescript
{
  id: string;
  name: string;
  email: string;
  gender: string;
  role: string;
  department?: string;
  employeeId?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

**Validações**:
- ID do usuário é obrigatório
- Usuário deve existir

## 🏛️ Benefícios da Arquitetura

### 1. **Separação de Responsabilidades**
- **Controllers**: Lidam apenas com HTTP
- **Use Cases**: Contêm a lógica de negócio
- **Repositories**: Acessam dados
- **Entities**: Representam o domínio

### 2. **Testabilidade**
```typescript
// Exemplo de teste de caso de uso
describe('RegisterUser', () => {
  it('should register a new user successfully', async () => {
    const mockRepository = createMockRepository();
    const mockAuthService = createMockAuthService();
    const useCase = new RegisterUser(mockRepository, mockAuthService);
    
    const result = await useCase.execute({
      name: 'João Silva',
      email: 'joao@empresa.com',
      password: 'senha123',
      gender: 'MALE'
    });
    
    expect(result.user.name).toBe('João Silva');
    expect(result.accessToken).toBeDefined();
  });
});
```

### 3. **Reutilização**
- Casos de uso podem ser reutilizados em diferentes interfaces (API, CLI, etc.)
- Lógica de negócio centralizada

### 4. **Manutenibilidade**
- Mudanças na lógica ficam isoladas nos casos de uso
- Fácil de entender e modificar

## 🔧 Como Criar um Novo Caso de Uso

### 1. **Definir a Interface**
```typescript
export interface MeuCasoDeUsoRequest {
  campo1: string;
  campo2: number;
}

export interface MeuCasoDeUsoResponse {
  resultado: string;
}
```

### 2. **Implementar a Classe**
```typescript
export class MeuCasoDeUso {
  constructor(
    private repository: IRepository,
    private service: IService
  ) {}

  async execute(request: MeuCasoDeUsoRequest): Promise<MeuCasoDeUsoResponse> {
    // 1. Validar entrada
    this.validateRequest(request);
    
    // 2. Executar lógica de negócio
    const resultado = await this.processarDados(request);
    
    // 3. Retornar resposta
    return { resultado };
  }

  private validateRequest(request: MeuCasoDeUsoRequest): void {
    // Validações específicas
  }
}
```

### 3. **Registrar no Controller**
```typescript
export class MeuController {
  constructor(private meuCasoDeUso: MeuCasoDeUso) {}

  async minhaAction(req: Request, res: Response): Promise<void> {
    const result = await this.meuCasoDeUso.execute(req.body);
    res.json(result);
  }
}
```

## 🎯 Próximos Casos de Uso a Implementar

### Gestão de Voos
- `CreateFlight` - Criar voo
- `SearchFlights` - Buscar voos disponíveis
- `UpdateFlightStatus` - Atualizar status do voo

### Gestão de Itinerários
- `CreateItinerary` - Criar itinerário
- `SearchItineraries` - Buscar itinerários
- `ValidateItinerary` - Validar sequência de voos

### Gestão de Reservas
- `CreateBooking` - Criar reserva
- `CancelBooking` - Cancelar reserva
- `ConfirmBooking` - Confirmar reserva
- `GetUserBookings` - Listar reservas do usuário

## 📚 Princípios Aplicados

### 1. **Dependency Inversion**
- Casos de uso dependem de abstrações (interfaces)
- Não dependem de implementações concretas

### 2. **Single Responsibility**
- Cada caso de uso tem uma responsabilidade específica
- Não mistura diferentes tipos de lógica

### 3. **Open/Closed Principle**
- Fácil de estender sem modificar código existente
- Novos casos de uso não afetam os existentes

### 4. **Interface Segregation**
- Interfaces pequenas e específicas
- Dependências mínimas necessárias

## 🧪 Testes de Casos de Uso

### Estrutura de Testes
```
tests/
├── useCases/
│   ├── auth/
│   │   ├── RegisterUser.test.ts
│   │   ├── LoginUser.test.ts
│   │   └── RefreshToken.test.ts
│   └── user/
│       └── GetUserProfile.test.ts
```

### Exemplo de Teste
```typescript
describe('RegisterUser', () => {
  let useCase: RegisterUser;
  let mockRepository: jest.Mocked<IUsersRepository>;
  let mockAuthService: jest.Mocked<AuthService>;

  beforeEach(() => {
    mockRepository = createMockRepository();
    mockAuthService = createMockAuthService();
    useCase = new RegisterUser(mockRepository, mockAuthService);
  });

  it('should register user successfully', async () => {
    // Arrange
    const request = {
      name: 'João Silva',
      email: 'joao@empresa.com',
      password: 'senha123',
      gender: 'MALE'
    };

    mockRepository.findByEmail.mockResolvedValue(null);
    mockRepository.create.mockResolvedValue();
    mockAuthService.generateAccessToken.mockReturnValue('access_token');
    mockAuthService.generateRefreshToken.mockReturnValue('refresh_token');

    // Act
    const result = await useCase.execute(request);

    // Assert
    expect(result.user.name).toBe('João Silva');
    expect(result.accessToken).toBe('access_token');
    expect(mockRepository.create).toHaveBeenCalled();
  });
});
```

Esta arquitetura torna o código mais organizado, testável e manutenível, seguindo os princípios da Clean Architecture! 🚀 