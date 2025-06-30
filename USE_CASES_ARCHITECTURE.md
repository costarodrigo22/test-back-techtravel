# Arquitetura de Casos de Uso - Clean Architecture

## 🏗️ Visão Geral

Este projeto segue os princípios da **Clean Architecture** com foco em **Casos de Uso** (Use Cases). Os casos de uso encapsulam a lógica de negócio específica da aplicação, tornando o código mais organizado, testável e manutenível.

## 📁 Estrutura de Casos de Uso

```
src/useCases/
├── airline/                 # Casos de uso de companhias aéreas
│   ├── CreateAirline.ts    # Criar companhia aérea
│   ├── GetAirlineById.ts   # Buscar companhia por ID
│   ├── ListAirlines.ts     # Listar companhias
│   ├── UpdateAirline.ts    # Atualizar companhia
│   └── DeleteAirline.ts    # Deletar companhia
├── airport/                 # Casos de uso de aeroportos
│   ├── CreateAirport.ts    # Criar aeroporto
│   ├── GetAirportById.ts   # Buscar aeroporto por ID
│   ├── ListAirports.ts     # Listar aeroportos
│   ├── UpdateAirport.ts    # Atualizar aeroporto
│   └── DeleteAirport.ts    # Deletar aeroporto
├── auth/                    # Casos de uso de autenticação
│   ├── RegisterUser.ts     # Cadastro de usuário
│   ├── LoginUser.ts        # Login de usuário
│   └── RefreshToken.ts     # Renovação de token
├── availability/            # Casos de uso de disponibilidade
│   └── SearchAvailability.ts # Buscar disponibilidade de voos
├── booking/                 # Casos de uso de reservas
│   ├── CreateBooking.ts    # Criar reserva
│   ├── GetUserBookings.ts  # Listar reservas do usuário
│   └── CancelBooking.ts    # Cancelar reserva
├── flight/                  # Casos de uso de voos
│   ├── CreateFlight.ts     # Criar voo
│   ├── GetFlightById.ts    # Buscar voo por ID
│   ├── ListFlights.ts      # Listar voos
│   ├── UpdateFlight.ts     # Atualizar voo
│   └── DeleteFlight.ts     # Deletar voo
├── itinerary/               # Casos de uso de itinerários
│   ├── CreateItinerary.ts  # Criar itinerário
│   ├── GetItineraryById.ts # Buscar itinerário por ID
│   ├── ListItineraries.ts  # Listar itinerários
│   └── DeleteItinerary.ts  # Deletar itinerário
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

### **1. Autenticação**

#### RegisterUser
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

#### LoginUser
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
  };
  accessToken: string;
  refreshToken: string;
}
```

**Validações**:
- Email deve ser válido
- Senha é obrigatória
- Credenciais devem ser válidas

#### RefreshToken
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

### **2. Usuários**

#### GetUserProfile
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
  createdAt: Date;
  updatedAt: Date;
}
```

**Validações**:
- ID do usuário é obrigatório
- Usuário deve existir

### **3. Companhias Aéreas**

#### CreateAirline
**Propósito**: Criar uma nova companhia aérea

**Request**:
```typescript
{
  name: string;
  iata_code: string;
}
```

**Response**:
```typescript
{
  id: string;
  name: string;
  iata_code: string;
  createdAt: Date;
  updatedAt: Date;
}
```

**Validações**:
- Nome é obrigatório
- Código IATA é obrigatório e único
- Código IATA deve ter 2-3 caracteres

#### GetAirlineById
**Propósito**: Buscar companhia aérea por ID

**Request**:
```typescript
{
  id: string;
}
```

**Response**:
```typescript
{
  id: string;
  name: string;
  iata_code: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### ListAirlines
**Propósito**: Listar todas as companhias aéreas

**Request**:
```typescript
{}
```

**Response**:
```typescript
{
  airlines: Array<{
    id: string;
    name: string;
    iata_code: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
}
```

#### UpdateAirline
**Propósito**: Atualizar dados de uma companhia aérea

**Request**:
```typescript
{
  id: string;
  name?: string;
  iata_code?: string;
}
```

**Response**:
```typescript
{
  id: string;
  name: string;
  iata_code: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### DeleteAirline
**Propósito**: Remover uma companhia aérea

**Request**:
```typescript
{
  id: string;
}
```

**Response**:
```typescript
{
  success: boolean;
}
```

### **4. Aeroportos**

#### CreateAirport
**Propósito**: Criar um novo aeroporto

**Request**:
```typescript
{
  name: string;
  iata_code: string;
}
```

**Response**:
```typescript
{
  id: string;
  name: string;
  iata_code: string;
  createdAt: Date;
  updatedAt: Date;
}
```

**Validações**:
- Nome é obrigatório
- Código IATA é obrigatório e único
- Código IATA deve ter 3 caracteres

#### GetAirportById
**Propósito**: Buscar aeroporto por ID

**Request**:
```typescript
{
  id: string;
}
```

**Response**:
```typescript
{
  id: string;
  name: string;
  iata_code: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### ListAirports
**Propósito**: Listar todos os aeroportos

**Request**:
```typescript
{}
```

**Response**:
```typescript
{
  airports: Array<{
    id: string;
    name: string;
    iata_code: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
}
```

#### UpdateAirport
**Propósito**: Atualizar dados de um aeroporto

**Request**:
```typescript
{
  id: string;
  name?: string;
  iata_code?: string;
}
```

**Response**:
```typescript
{
  id: string;
  name: string;
  iata_code: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### DeleteAirport
**Propósito**: Remover um aeroporto

**Request**:
```typescript
{
  id: string;
}
```

**Response**:
```typescript
{
  success: boolean;
}
```

### **5. Voos**

#### CreateFlight
**Propósito**: Criar um novo voo

**Request**:
```typescript
{
  flight_number: string;
  airline_id: string;
  origin_iata: string;
  destination_iata: string;
  departure_datetime: string;
  arrival_datetime: string;
  frequency: number[];
}
```

**Response**:
```typescript
{
  id: string;
  flight_number: string;
  airline_id: string;
  origin_iata: string;
  destination_iata: string;
  departure_datetime: Date;
  arrival_datetime: Date;
  frequency: number[];
  createdAt: Date;
  updatedAt: Date;
}
```

**Validações**:
- Número do voo é obrigatório
- Companhia aérea deve existir
- Aeroportos de origem e destino devem existir
- Data de partida deve ser anterior à chegada
- Frequência deve ser um array válido

#### GetFlightById
**Propósito**: Buscar voo por ID

**Request**:
```typescript
{
  id: string;
}
```

**Response**:
```typescript
{
  id: string;
  flight_number: string;
  airline_id: string;
  origin_iata: string;
  destination_iata: string;
  departure_datetime: Date;
  arrival_datetime: Date;
  frequency: number[];
  createdAt: Date;
  updatedAt: Date;
}
```

#### ListFlights
**Propósito**: Listar voos com filtros opcionais

**Request**:
```typescript
{
  airline_id?: string;
  origin_iata?: string;
  destination_iata?: string;
}
```

**Response**:
```typescript
{
  flights: Array<{
    id: string;
    flight_number: string;
    airline_id: string;
    origin_iata: string;
    destination_iata: string;
    departure_datetime: Date;
    arrival_datetime: Date;
    frequency: number[];
    createdAt: Date;
    updatedAt: Date;
  }>;
}
```

#### UpdateFlight
**Propósito**: Atualizar dados de um voo

**Request**:
```typescript
{
  id: string;
  flight_number?: string;
  airline_id?: string;
  origin_iata?: string;
  destination_iata?: string;
  departure_datetime?: string;
  arrival_datetime?: string;
  frequency?: number[];
}
```

**Response**:
```typescript
{
  id: string;
  flight_number: string;
  airline_id: string;
  origin_iata: string;
  destination_iata: string;
  departure_datetime: Date;
  arrival_datetime: Date;
  frequency: number[];
  createdAt: Date;
  updatedAt: Date;
}
```

#### DeleteFlight
**Propósito**: Remover um voo

**Request**:
```typescript
{
  id: string;
}
```

**Response**:
```typescript
{
  success: boolean;
}
```

### **6. Itinerários**

#### CreateItinerary
**Propósito**: Criar um itinerário composto por voos

**Request**:
```typescript
{
  flight_ids: string[];
}
```

**Response**:
```typescript
{
  id: string;
  flight_ids: string[];
  origin_iata: string;
  destination_iata: string;
  departure_datetime: Date;
  arrival_datetime: Date;
  stops: number;
  createdAt: Date;
  updatedAt: Date;
}
```

**Validações**:
- Array de voos é obrigatório
- Voos devem existir
- Voos devem formar uma rota válida
- Tempo entre voos deve ser adequado

#### GetItineraryById
**Propósito**: Buscar itinerário por ID

**Request**:
```typescript
{
  id: string;
}
```

**Response**:
```typescript
{
  id: string;
  flight_ids: string[];
  origin_iata: string;
  destination_iata: string;
  departure_datetime: Date;
  arrival_datetime: Date;
  stops: number;
  flights: Array<Flight>;
  createdAt: Date;
  updatedAt: Date;
}
```

#### ListItineraries
**Propósito**: Listar itinerários

**Request**:
```typescript
{}
```

**Response**:
```typescript
{
  itineraries: Array<{
    id: string;
    origin_iata: string;
    destination_iata: string;
    departure_datetime: Date;
    arrival_datetime: Date;
    stops: number;
    createdAt: Date;
    updatedAt: Date;
  }>;
}
```

#### DeleteItinerary
**Propósito**: Remover um itinerário

**Request**:
```typescript
{
  id: string;
}
```

**Response**:
```typescript
{
  success: boolean;
}
```

### **7. Disponibilidade**

#### SearchAvailability
**Propósito**: Buscar disponibilidade de voos com filtros

**Request**:
```typescript
{
  origin: string;
  destination: string;
  departure_date: string;
  return_date?: string;
  airlines?: string[];
  max_stops?: number;
}
```

**Response**:
```typescript
{
  outbound_itineraries: Array<Itinerary>;
  inbound_itineraries: Array<Itinerary>;
}
```

**Validações**:
- Origem e destino são obrigatórios
- Data de partida é obrigatória
- Data de retorno é opcional
- Filtros de companhias e paradas são opcionais

### **8. Reservas**

#### CreateBooking
**Propósito**: Criar uma reserva para um usuário

**Request**:
```typescript
{
  user_id: string;
  itinerary_id: string;
}
```

**Response**:
```typescript
{
  id: string;
  user_id: string;
  itinerary_id: string;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
}
```

**Validações**:
- Usuário deve existir
- Itinerário deve existir
- Usuário não pode ter reserva duplicada

#### GetUserBookings
**Propósito**: Listar reservas de um usuário

**Request**:
```typescript
{
  userId: string;
}
```

**Response**:
```typescript
{
  bookings: Array<{
    id: string;
    user_id: string;
    itinerary_id: string;
    status: BookingStatus;
    itinerary: Itinerary;
    createdAt: Date;
    updatedAt: Date;
  }>;
}
```

**Validações**:
- Usuário deve existir

#### CancelBooking
**Propósito**: Cancelar uma reserva

**Request**:
```typescript
{
  id: string;
}
```

**Response**:
```typescript
{
  id: string;
  user_id: string;
  itinerary_id: string;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
}
```

**Validações**:
- Reserva deve existir
- Reserva não pode estar já cancelada

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

export interface IMeuCasoDeUso {
  execute(request: MeuCasoDeUsoRequest): Promise<MeuCasoDeUsoResponse>;
}
```

### 2. **Implementar o Caso de Uso**
```typescript
export class MeuCasoDeUso implements IMeuCasoDeUso {
  constructor(
    private repository: IMeuRepository
  ) {}

  async execute(request: MeuCasoDeUsoRequest): Promise<MeuCasoDeUsoResponse> {
    // Validações
    if (!request.campo1) {
      throw { status: 400, message: 'Campo1 é obrigatório' };
    }

    // Lógica de negócio
    const resultado = await this.repository.findByCampo(request.campo1);

    return {
      resultado: resultado.toString()
    };
  }
}
```

### 3. **Registrar no Container**
```typescript
// di/Container.ts
this.registerFactory('IMeuCasoDeUso', () => 
  new MeuCasoDeUso(this.resolve('IMeuRepository'))
);
```

### 4. **Criar o Controller**
```typescript
export class MeuController {
  constructor(
    private meuCasoDeUso: IMeuCasoDeUso
  ) {}

  async meuMetodo(req: Request, res: Response) {
    try {
      const result = await this.meuCasoDeUso.execute(req.body);
      return res.json(result);
    } catch (error: any) {
      if (error.status && error.message) {
        return res.status(error.status).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}
```

### 5. **Adicionar as Rotas**
```typescript
// factories/RouteFactory.ts
createMeuRotas(controller: MeuController): Router {
  const router = Router();
  router.post('/meu-endpoint', (req, res) => controller.meuMetodo(req, res));
  return router;
}
```

## 🎯 Padrões de Validação

### **Validações de Entrada**
```typescript
// Sempre validar no início do execute
if (!request.campo) {
  throw { status: 400, message: 'Campo é obrigatório' };
}
```

### **Validações de Negócio**
```typescript
// Verificar regras de negócio
const existing = await this.repository.findByEmail(request.email);
if (existing) {
  throw { status: 409, message: 'Email já está em uso' };
}
```

### **Validações de Existência**
```typescript
// Verificar se entidades existem
const entity = await this.repository.findById(request.id);
if (!entity) {
  throw { status: 404, message: 'Entidade não encontrada' };
}
```

## 📚 Conclusão

A arquitetura de casos de uso implementada neste projeto proporciona:

- **Organização clara** do código
- **Separação de responsabilidades** bem definida
- **Testabilidade** excepcional
- **Manutenibilidade** facilitada
- **Escalabilidade** para crescimento

Cada caso de uso encapsula uma funcionalidade específica, tornando o sistema mais modular e fácil de manter. 