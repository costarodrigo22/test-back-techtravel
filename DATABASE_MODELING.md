# Modelagem do Banco de Dados - Sistema de Gestão de Viagens Corporativas

## Visão Geral

Este documento descreve a modelagem completa do banco de dados para o sistema de gestão de viagens corporativas, incluindo todas as entidades, relacionamentos e regras de negócio.

## Entidades Principais

### 1. User (Usuário)
**Propósito**: Gerenciar usuários do sistema

**Campos**:
- `id`: Identificador único (UUID)
- `name`: Nome completo do usuário
- `email`: Email corporativo (único)
- `password`: Senha criptografada
- `gender`: Gênero (MALE, FEMALE, OTHER)
- `createdAt`: Data de criação
- `updatedAt`: Data da última atualização

**Relacionamentos**:
- Um usuário pode ter múltiplas reservas (1:N com Booking)

### 2. Airline (Companhia Aérea)
**Propósito**: Cadastrar companhias aéreas disponíveis no sistema

**Campos**:
- `id`: Identificador único (UUID)
- `name`: Nome da companhia aérea
- `iataCode`: Código IATA único (ex: "LA" para LATAM)
- `country`: País de origem
- `isActive`: Status ativo/inativo
- `createdAt`: Data de criação
- `updatedAt`: Data da última atualização

**Relacionamentos**:
- Uma companhia pode ter múltiplos voos (1:N com Flight)

### 3. Airport (Aeroporto)
**Propósito**: Cadastrar aeroportos e localidades

**Campos**:
- `id`: Identificador único (UUID)
- `name`: Nome completo do aeroporto
- `iataCode`: Código IATA único (ex: "IMP" para Imperatriz)
- `city`: Cidade onde está localizado
- `country`: País
- `timezone`: Fuso horário
- `latitude`: Latitude (opcional)
- `longitude`: Longitude (opcional)
- `isActive`: Status ativo/inativo
- `createdAt`: Data de criação
- `updatedAt`: Data da última atualização

**Relacionamentos**:
- Um aeroporto pode ser origem de múltiplos voos (1:N com Flight)
- Um aeroporto pode ser destino de múltiplos voos (1:N com Flight)

### 4. Flight (Voo)
**Propósito**: Representar voos disponíveis

**Campos**:
- `id`: Identificador único (UUID)
- `flightNumber`: Número do voo (ex: "LA3456")
- `airlineId`: Referência para Airline
- `originIata`: Código IATA do aeroporto de origem
- `destinationIata`: Código IATA do aeroporto de destino
- `departureDatetime`: Data/hora de partida (UTC)
- `arrivalDatetime`: Data/hora de chegada (UTC)
- `frequency`: Array com dias da semana (0=Domingo, 1=Segunda, etc.)
- `aircraftType`: Tipo de aeronave (opcional)
- `capacity`: Capacidade do voo (opcional)
- `status`: Status do voo (SCHEDULED, DELAYED, CANCELLED, etc.)
- `gate`: Portão de embarque (opcional)
- `terminal`: Terminal (opcional)
- `createdAt`: Data de criação
- `updatedAt`: Data da última atualização

**Métodos**:
- `operatesOn(dayOfWeek)`: Verifica se o voo opera em um dia específico
- `getDurationInMinutes()`: Calcula duração do voo em minutos

**Relacionamentos**:
- Pertence a uma Airline (N:1)
- Origem em um Airport (N:1)
- Destino em um Airport (N:1)
- Pode fazer parte de múltiplos Itineraries (N:M através de flightIds)

### 5. Itinerary (Itinerário)
**Propósito**: Representar rotas de viagem compostas por múltiplos voos

**Campos**:
- `id`: Identificador único (UUID)
- `flightIds`: Array ordenado com IDs dos voos
- `type`: Tipo de itinerário (ONE_WAY, ROUND_TRIP, MULTI_CITY)
- `originIata`: Código IATA de origem
- `destinationIata`: Código IATA de destino
- `totalDuration`: Duração total em minutos
- `totalPrice`: Preço total (opcional)
- `stops`: Número de paradas
- `isActive`: Status ativo/inativo
- `createdAt`: Data de criação
- `