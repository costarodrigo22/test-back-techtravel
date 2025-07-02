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
   # ou para produção
   npm run build && npm start
   ```

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

© 2025 TechTravel API teste. 