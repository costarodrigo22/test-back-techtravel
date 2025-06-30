# Sistema de Gestão de Viagens Corporativas - Backend

Sistema completo para gestão de viagens corporativas com autenticação JWT, gestão de companhias aéreas, aeroportos, voos, itinerários, busca de disponibilidade e reservas, seguindo os princípios da Clean Architecture com Inversion of Control e Dependency Injection.

## 🚀 Tecnologias

- **Node.js 18+** com TypeScript
- **Express.js** para APIs REST
- **Prisma** como ORM
- **PostgreSQL** como banco de dados
- **JWT** para autenticação
- **bcryptjs** para hash de senhas
- **Docker Compose** para PostgreSQL local
- **Clean Architecture** com IoC e DI

## 🎯 Justificativa da Escolha do Framework

### **Node.js + Express.js + TypeScript**

**Por que Node.js?**
- **Performance**: Event-driven, não-bloqueante, ideal para APIs REST
- **Ecossistema rico**: NPM com milhares de pacotes
- **Desenvolvimento rápido**: Hot reload, debugging fácil
- **Escalabilidade**: Suporte nativo a microserviços
- **Comunidade ativa**: Documentação abundante e suporte

**Por que Express.js?**
- **Simplicidade**: Framework minimalista e flexível
- **Middleware ecosystem**: Grande variedade de middlewares
- **Performance**: Rápido e leve
- **Maturidade**: Framework estável e bem estabelecido
- **Flexibilidade**: Permite implementar Clean Architecture sem interferências

**Por que TypeScript?**
- **Type Safety**: Reduz bugs em tempo de compilação
- **IntelliSense**: Melhor experiência de desenvolvimento
- **Refactoring seguro**: Mudanças automáticas e seguras
- **Interfaces**: Fundamental para Clean Architecture
- **Manutenibilidade**: Código mais legível e documentado

## 🏗️ Arquitetura de Software

### **Clean Architecture (Arquitetura Limpa)**

O projeto implementa a **Clean Architecture** de Robert C. Martin, também conhecida como **Arquitetura Hexagonal** ou **Arquitetura em Cebola**. Esta arquitetura é escolhida pelos seguintes benefícios:

#### **Princípios Fundamentais:**
1. **Independência de Frameworks**: A lógica de negócio não depende de Express.js
2. **Testabilidade**: Cada camada pode ser testada independentemente
3. **Independência de UI**: A interface pode ser alterada sem afetar a lógica
4. **Independência de Banco**: O banco pode ser trocado sem afetar o domínio
5. **Independência de Agentes Externos**: APIs externas não afetam a lógica

#### **Camadas da Arquitetura:**

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│  Controllers, Routes, Middlewares, HTTP/JSON handling      │
├─────────────────────────────────────────────────────────────┤
│                   Application Layer                         │
│  Use Cases, Application Services, Business Logic           │
├─────────────────────────────────────────────────────────────┤
│                     Domain Layer                            │
│  Entities, Value Objects, Domain Services, Business Rules  │
├─────────────────────────────────────────────────────────────┤
│                  Infrastructure Layer                       │
│  Repositories, Database, External APIs, File System        │
└─────────────────────────────────────────────────────────────┘
```

#### **Dependency Inversion Principle (DIP):**
- **Módulos de alto nível** não dependem de módulos de baixo nível
- **Ambos dependem de abstrações** (interfaces)
- **Abstrações não dependem de detalhes**

#### **Inversion of Control (IoC) + Dependency Injection (DI):**
- **Container** gerencia o ciclo de vida dos objetos
- **Dependências** são injetadas via construtor
- **Testes** facilitados com mocks
- **Acoplamento** reduzido entre classes

## 📋 Pré-requisitos

- Node.js 18+
- Docker e Docker Compose (apenas para PostgreSQL)
- npm ou yarn

## 🏗️ Estrutura do Projeto

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
│   ├── airline/         # Casos de uso de companhias aéreas
│   ├── airport/         # Casos de uso de aeroportos
│   ├── auth/            # Casos de uso de autenticação
│   ├── availability/    # Casos de uso de disponibilidade
│   ├── booking/         # Casos de uso de reservas
│   ├── flight/          # Casos de uso de voos
│   ├── itinerary/       # Casos de uso de itinerários
│   └── user/            # Casos de uso de usuário
└── app.ts               # Aplicação principal
```

## 🔄 Casos de Uso Implementados

### **Autenticação**
- **RegisterUser** - Cadastro de usuário
- **LoginUser** - Login de usuário
- **RefreshToken** - Renovação de token

### **Usuários**
- **GetUserProfile** - Obter perfil do usuário

### **Companhias Aéreas**
- **CreateAirline** - Criar companhia aérea
- **GetAirlineById** - Buscar companhia por ID
- **ListAirlines** - Listar companhias
- **UpdateAirline** - Atualizar companhia
- **DeleteAirline** - Deletar companhia

### **Aeroportos**
- **CreateAirport** - Criar aeroporto
- **GetAirportById** - Buscar aeroporto por ID
- **ListAirports** - Listar aeroportos
- **UpdateAirport** - Atualizar aeroporto
- **DeleteAirport** - Deletar aeroporto

### **Voos**
- **CreateFlight** - Criar voo
- **GetFlightById** - Buscar voo por ID
- **ListFlights** - Listar voos
- **UpdateFlight** - Atualizar voo
- **DeleteFlight** - Deletar voo

### **Itinerários**
- **CreateItinerary** - Criar itinerário
- **GetItineraryById** - Buscar itinerário por ID
- **ListItineraries** - Listar itinerários
- **DeleteItinerary** - Deletar itinerário

### **Disponibilidade**
- **SearchAvailability** - Buscar disponibilidade de voos

### **Reservas**
- **CreateBooking** - Criar reserva
- **GetUserBookings** - Listar reservas do usuário
- **CancelBooking** - Cancelar reserva

## 🛠️ Instalação e Configuração

### 1. Clone o repositório
```bash
git clone <repository-url>
cd test-back-techtravel
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env` baseado no `.env.example`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/travel_management"
JWT_SECRET="seu_jwt_secret_aqui"
JWT_REFRESH_SECRET="seu_jwt_refresh_secret_aqui"
PORT=3000
```

### 4. Inicie o banco de dados com Docker
```bash
docker-compose up -d
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

## 📚 APIs

### **Autenticação**

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

#### POST /auth/login
Fazer login.

**Body:**
```json
{
  "email": "joao@empresa.com",
  "password": "senha123"
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

### **Usuários (Rotas Privadas)**

#### GET /users/profile
Obter perfil do usuário autenticado.

#### GET /users/:userId/bookings
Listar reservas de um usuário.

### **Companhias Aéreas (Rotas Privadas)**

#### GET /airlines
Listar companhias aéreas.

#### GET /airlines/:id
Buscar companhia por ID.

#### POST /airlines
Criar companhia aérea.

#### PUT /airlines/:id
Atualizar companhia.

#### DELETE /airlines/:id
Deletar companhia.

### **Aeroportos (Rotas Privadas)**

#### GET /airports
Listar aeroportos.

#### GET /airports/:id
Buscar aeroporto por ID.

#### POST /airports
Criar aeroporto.

#### PUT /airports/:id
Atualizar aeroporto.

#### DELETE /airports/:id
Deletar aeroporto.

### **Voos (Rotas Privadas)**

#### GET /flights
Listar voos.

#### GET /flights/:id
Buscar voo por ID.

#### POST /flights
Criar voo.

#### PUT /flights/:id
Atualizar voo.

#### DELETE /flights/:id
Deletar voo.

### **Itinerários (Rotas Privadas)**

#### GET /itineraries
Listar itinerários.

#### GET /itineraries/:id
Buscar itinerário por ID.

#### POST /itineraries
Criar itinerário.

#### DELETE /itineraries/:id
Deletar itinerário.

### **Disponibilidade (Rotas Privadas)**

#### POST /availability/search
Buscar disponibilidade de voos.

**Body:**
```json
{
  "origin": "GRU",
  "destination": "JFK",
  "departure_date": "2024-02-15",
  "return_date": "2024-02-20",
  "airlines": ["LA", "AA"],
  "max_stops": 1
}
```

### **Reservas (Rotas Privadas)**

#### POST /bookings
Criar reserva.

**Body:**
```json
{
  "user_id": "user-uuid",
  "itinerary_id": "itinerary-uuid"
}
```

#### GET /users/:userId/bookings
Listar reservas de um usuário.

#### DELETE /bookings/:id
Cancelar reserva.

### **Health Check**

#### GET /health
Verificar status da aplicação.

## 🔐 Autenticação

O sistema usa JWT (JSON Web Tokens) para autenticação:

- **Access Token**: Expira em 15 minutos
- **Refresh Token**: Expira em 7 dias
- **Header**: `Authorization: Bearer <token>`

## 🗄️ Banco de Dados

### **Entidades Principais:**
- **User**: Usuários do sistema
- **Airline**: Companhias aéreas
- **Airport**: Aeroportos
- **Flight**: Voos
- **Itinerary**: Itinerários (composição de voos)
- **Booking**: Reservas de usuários

### **Relacionamentos:**
- User → Booking (1:N)
- Airline → Flight (1:N)
- Airport → Flight (origem/destino) (1:N)
- Flight → Itinerary (N:M)
- Itinerary → Booking (1:N)

## 🔧 Scripts Disponíveis

- `npm run dev` - Iniciar em modo desenvolvimento
- `npm run build` - Compilar TypeScript
- `npm start` - Iniciar em produção
- `npm run prisma:generate` - Gerar cliente Prisma
- `npm run prisma:migrate` - Executar migrações
- `npm run prisma:studio` - Abrir Prisma Studio

## 🚨 Segurança

- Senhas são hasheadas com bcrypt
- JWT tokens com expiração
- Refresh tokens para renovação segura
- Validação de entrada em todos os casos de uso
- CORS configurado
- Middleware de autenticação em rotas privadas

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
7. **Adicionar documentação** com Swagger/OpenAPI
8. **Implementar notificações** por email

## 📚 Documentação Adicional

- [Modelagem do Banco de Dados](./DATABASE_MODELING.md)
- [Arquitetura de Casos de Uso](./USE_CASES_ARCHITECTURE.md)
- [Clean Architecture com IoC e DI](./CLEAN_ARCHITECTURE.md) 