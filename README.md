# Sistema de Gestão de Viagens Corporativas - Backend

## 🚦 Passo a passo para rodar o projeto e popular o banco (para recrutadores)

1. **Clone o repositório e acesse a pasta do projeto:**
   ```sh
   git clone https://github.com/costarodrigo22/test-back-techtravel.git
   cd test-back-techtravel
   ```

2. **Copie o arquivo de variáveis de ambiente:**
   ```sh
   cp .env.example .env
   # Edite o .env se necessário (por padrão já funciona com o Docker)
   ```


3. **Instale as dependências, gere o Prisma Client e rode as migrações:**
   ```sh
   make setup
   ```

4. **(Opcional, mas recomendado) Popule o banco com dados de exemplo:**
   ```sh
   make seed
   ```
   > Isso cria um usuário de testes:
   > - **Email:** recrutador@teste.com
   > - **Senha:** senha123

5. **Inicie a aplicação em modo desenvolvimento:**
   ```sh
   make dev
   ```

6. **Acesse a API:**
   - Por padrão, estará em: http://localhost:3000

7. **Para rodar os testes:**
   ```sh
   make test
   ```

8. **Para parar o banco de dados:**
   ```sh
   make down
   ```

---

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

### 9. Buscar Disponibilidade de Itinerários

**POST /availability/search**
```json
POST http://localhost:3000/availability/search
Content-Type: application/json
Authorization: Bearer <SEU_TOKEN_JWT>

{
  "origin_iata": "GRU",
  "destination_iata": "JFK",
  "departure_date": "2024-07-10",
  "return_date": "2024-07-20"
}
```

### 10. Refresh Token

**POST /auth/refresh-token**
```json
POST http://localhost:3000/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "<SEU_REFRESH_TOKEN>"
}
```

### 11. Buscar Companhia Aérea por ID

**GET /airlines/{id}**
```
GET http://localhost:3000/airlines/<ID_DA_AIRLINE>
Authorization: Bearer <SEU_TOKEN_JWT>
```

### 12. Buscar Aeroporto por ID

**GET /airports/{id}**
```
GET http://localhost:3000/airports/<ID_DO_AEROPORTO>
Authorization: Bearer <SEU_TOKEN_JWT>
```

### 13. Buscar Voo por ID

**GET /flights/{id}**
```
GET http://localhost:3000/flights/<ID_DO_VOO>
Authorization: Bearer <SEU_TOKEN_JWT>
```

### 14. Buscar Itinerário por ID

**GET /itineraries/{id}**
```
GET http://localhost:3000/itineraries/<ID_DO_ITINERARIO>
Authorization: Bearer <SEU_TOKEN_JWT>
```

### 15. Listar Reservas de um Usuário por ID

**GET /users/{userId}/bookings**
```
GET http://localhost:3000/users/<ID_DO_USUARIO>/bookings
Authorization: Bearer <SEU_TOKEN_JWT>
```

---

## ✅ Checklist pós-clone (para rodar o projeto do zero)

1. **Clone o repositório**
   ```bash
   git clone https://github.com/costarodrigo22/test-back-techtravel.git
   cd test-back-techtravel
   ```
2. **Instale as dependências**
   ```bash
   npm install
   ```
3. **Configure as variáveis de ambiente**
   - Copie `.env.example` para `.env` e ajuste as variáveis:
     ```env
     DATABASE_URL="postgresql://postgres:postgres@localhost:5432/travel_management"
     JWT_SECRET="seu_jwt_secret_aqui"
     JWT_REFRESH_SECRET="seu_jwt_refresh_secret_aqui"
     PORT=3000
     ```
4. **Inicie o banco de dados com Docker**
   ```bash
   docker-compose up -d
   ```
5. **Execute as migrações do Prisma**
   ```bash
   npm run prisma:migrate
   ```
6. **Gere o cliente Prisma e arquivos necessários**
   ```bash
   npm run prisma:generate
   ```
7. **Inicie a aplicação**
   ```bash
   npm run dev
   ```

---

## 🛠️ Facilidade com Makefile

Se você possui o [make](https://www.gnu.org/software/make/) instalado (Linux, Mac ou Windows com WSL/Git Bash), pode rodar todos os comandos essenciais do projeto de forma simples:

```bash
make setup   # Instala dependências, sobe o banco, roda migrações e gera o Prisma Client
make dev     # Sobe a aplicação em modo desenvolvimento
make test    # Executa os testes
```

## 🌱 Populando o banco de dados (Seeding)

Para facilitar seus testes, você pode popular o banco com dados iniciais rodando:

```bash
make seed
```
Isso irá criar:
- Um usuário de testes:
  - **Email:** recrutador@teste.com
  - **Senha:** senha123
- Uma companhia aérea (TechTravel Airlines)
- Dois aeroportos (GRU e JFK)
- Um voo de GRU para JFK
- Um itinerário
- Uma reserva já vinculada ao usuário

Assim, você pode autenticar e testar a API imediatamente!

Assim, você não precisa se preocupar com comandos longos ou ordem de execução. 
---

## 🗂️ Observações sobre a pasta `generated`

- Arquivos em `src/generated` são criados automaticamente por ferramentas (ex: Prisma).
- Não são versionados no Git (estão no `.gitignore`).
- Sempre rode os comandos de geração após clonar o projeto (`npm run prisma:generate`).

---

## 📖 Documentação Interativa (Swagger)

- Acesse [http://localhost:3000/api-docs](http://localhost:3000/api-docs) após iniciar a API.
- Todos os endpoints estão documentados.
- Para endpoints protegidos, clique em **Authorize** e insira seu token JWT (obtido via `/auth/login`).
- Exemplos de request/response disponíveis na interface.

---

## 🧪 Testes Automatizados

- Testes unitários e de integração com **Jest**.
- Cobertura para casos de uso, controllers, middlewares e integrações principais.
- Para rodar os testes:
  ```bash
  npm test
  ```
- Os testes garantem a robustez das regras de negócio e integração entre camadas.

---

## 📚 Documentação Adicional

- [Modelagem do Banco de Dados](./DATABASE_MODELING.md)
- [Arquitetura de Casos de Uso](./USE_CASES_ARCHITECTURE.md)
- [Clean Architecture com IoC e DI](./CLEAN_ARCHITECTURE.md)

---

## 🤝 Contribuição e Contato

Contribuições são bem-vindas! Abra issues ou pull requests.

Dúvidas? Entre em contato pelo e-mail: [costarodrigosilva247@gmail.com]

---

## 📬 Exemplos de Requisições (Postman/Insomnia)

Aqui estão exemplos de requisições para testar os principais endpoints da API. Você pode copiar e colar no Postman, Insomnia ou similar.

### 1. Cadastro de Usuário

**POST /auth/register**
```json
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123",
  "gender": "MALE"
}
```

### 2. Login

**POST /auth/login**
```json
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "joao@email.com",
  "password": "senha123"
}
```

### 3. Cadastro de Companhia Aérea

**POST /airlines**
```json
POST http://localhost:3000/airlines
Content-Type: application/json
Authorization: Bearer <SEU_TOKEN_JWT>

{
  "name": "LATAM Airlines",
  "iata_code": "LA"
}
```

### 4. Cadastro de Aeroporto

**POST /airports**
```json
POST http://localhost:3000/airports
Content-Type: application/json
Authorization: Bearer <SEU_TOKEN_JWT>

{
  "name": "Aeroporto de Guarulhos",
  "iata_code": "GRU"
}
```

### 5. Cadastro de Voo

**POST /flights**
```json
POST http://localhost:3000/flights
Content-Type: application/json
Authorization: Bearer <SEU_TOKEN_JWT>

{
  "flight_number": "LA3456",
  "airline_id": "<ID_DA_AIRLINE>",
  "origin_iata": "GRU",
  "destination_iata": "JFK",
  "departure_datetime": "2024-07-02T10:00:00Z",
  "arrival_datetime": "2024-07-02T18:00:00Z",
  "frequency": [1,3,5]
}
```

### 6. Cadastro de Itinerário

**POST /itineraries**
```json
POST http://localhost:3000/itineraries
Content-Type: application/json
Authorization: Bearer <SEU_TOKEN_JWT>

{
  "flight_ids": ["<ID_VOO_1>", "<ID_VOO_2>"]
}
```

### 7. Criar Reserva

**POST /bookings**
```json
POST http://localhost:3000/bookings
Content-Type: application/json
Authorization: Bearer <SEU_TOKEN_JWT>

{
  "userId": "<ID_DO_USUARIO>",
  "itineraryId": "<ID_DO_ITINERARIO>"
}
```

### 8. Consultas (GET)

**Listar companhias aéreas:**
```
GET http://localhost:3000/airlines
Authorization: Bearer <SEU_TOKEN_JWT>
```

**Listar aeroportos:**
```
GET http://localhost:3000/airports
Authorization: Bearer <SEU_TOKEN_JWT>
```

**Listar voos:**
```
GET http://localhost:3000/flights
Authorization: Bearer <SEU_TOKEN_JWT>
```

**Listar itinerários:**
```
GET http://localhost:3000/itineraries
Authorization: Bearer <SEU_TOKEN_JWT>
```

**Listar reservas do usuário:**
```
GET http://localhost:3000/bookings
Authorization: Bearer <SEU_TOKEN_JWT>
```

### 9. Buscar Disponibilidade de Itinerários

**POST /availability/search**
```json
POST http://localhost:3000/availability/search
Content-Type: application/json
Authorization: Bearer <SEU_TOKEN_JWT>

{
  "origin_iata": "GRU",
  "destination_iata": "JFK",
  "departure_date": "2024-07-10",
  "return_date": "2024-07-20"
}
```

### 10. Refresh Token

**POST /auth/refresh-token**
```json
POST http://localhost:3000/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "<SEU_REFRESH_TOKEN>"
}
```

### 11. Buscar Companhia Aérea por ID

**GET /airlines/{id}**
```
GET http://localhost:3000/airlines/<ID_DA_AIRLINE>
Authorization: Bearer <SEU_TOKEN_JWT>
```

### 12. Buscar Aeroporto por ID

**GET /airports/{id}**
```
GET http://localhost:3000/airports/<ID_DO_AEROPORTO>
Authorization: Bearer <SEU_TOKEN_JWT>
```

### 13. Buscar Voo por ID

**GET /flights/{id}**
```
GET http://localhost:3000/flights/<ID_DO_VOO>
Authorization: Bearer <SEU_TOKEN_JWT>
```

### 14. Buscar Itinerário por ID

**GET /itineraries/{id}**
```
GET http://localhost:3000/itineraries/<ID_DO_ITINERARIO>
Authorization: Bearer <SEU_TOKEN_JWT>
```

### 15. Listar Reservas de um Usuário por ID

**GET /users/{userId}/bookings**
```
GET http://localhost:3000/users/<ID_DO_USUARIO>/bookings
Authorization: Bearer <SEU_TOKEN_JWT>
```

---

> Para mais exemplos, consulte a documentação Swagger em [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

© 2025 TechTravel API teste.