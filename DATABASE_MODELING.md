# Modelagem do Banco de Dados - Sistema de Gestão de Viagens Corporativas

## Visão Geral

Este documento descreve a modelagem completa do banco de dados para o sistema de gestão de viagens corporativas, incluindo todas as entidades, relacionamentos e regras de negócio.

## Entidades Principais

### 1. User (Usuário)
**Propósito**: Gerenciar usuários do sistema (colaboradores, gerentes, administradores)

**Campos**:
- `id`: Identificador único (UUID)
- `name`: Nome completo do usuário
- `email`: Email corporativo (único)
- `role`: Papel no sistema (EMPLOYEE, MANAGER, ADMIN)
- `department`: Departamento da empresa
- `employeeId`: ID do funcionário na empresa
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
- `updatedAt`: Data da última atualização

**Métodos**:
- `calculateStops()`: Calcula número de paradas
- `getFirstFlightId()`: Retorna ID do primeiro voo
- `getLastFlightId()`: Retorna ID do último voo

**Relacionamentos**:
- Contém múltiplos Flights (N:M através de flightIds)
- Pode ter múltiplas Bookings (1:N)

### 6. Booking (Reserva)
**Propósito**: Gerenciar reservas de itinerários pelos usuários

**Campos**:
- `id`: Identificador único (UUID)
- `userId`: Referência para User
- `itineraryId`: Referência para Itinerary
- `status`: Status da reserva (PENDING, CONFIRMED, CANCELLED, etc.)
- `bookingType`: Tipo de classe (BUSINESS, ECONOMY, FIRST_CLASS)
- `passengerCount`: Número de passageiros
- `totalPrice`: Preço total da reserva
- `confirmationCode`: Código de confirmação único
- `notes`: Observações adicionais
- `travelDate`: Data de viagem
- `returnDate`: Data de retorno (para ida e volta)
- `createdAt`: Data de criação
- `updatedAt`: Data da última atualização

**Métodos**:
- `confirm()`: Confirma a reserva
- `cancel()`: Cancela a reserva
- `isActive()`: Verifica se a reserva está ativa

**Relacionamentos**:
- Pertence a um User (N:1)
- Referencia um Itinerary (N:1)

## Diagrama de Relacionamentos

```
User (1) -----> (N) Booking (N) -----> (1) Itinerary (N) -----> (M) Flight
                                                                    |
                                                                    v
Airline (1) -----> (N) Flight (N) -----> (1) Airport (1) <----- (N) Flight
```

## Regras de Negócio

### Validações de Itinerário
1. **Sequência de Voos**: Os voos devem estar em ordem cronológica
2. **Conexões**: Tempo mínimo de conexão entre voos (ex: 30 minutos)
3. **Aeroportos**: O destino de um voo deve ser a origem do próximo
4. **Datas**: Todos os voos devem estar na mesma data ou sequência lógica

### Validações de Reserva
1. **Disponibilidade**: Verificar se há assentos disponíveis
2. **Status do Voo**: Voo deve estar com status SCHEDULED
3. **Limite de Reservas**: Usuário pode ter limite de reservas ativas
4. **Prazo de Confirmação**: Reservas pendentes expiram após 24h

### Validações de Voo
1. **Frequência**: Voo só opera nos dias especificados
2. **Horários**: Horário de chegada deve ser posterior ao de partida
3. **Aeroportos**: Origem e destino devem ser diferentes
4. **Capacidade**: Não pode exceder capacidade da aeronave

## Índices Recomendados

### Performance de Consultas
- `Flight`: (originIata, destinationIata, departureDatetime)
- `Flight`: (airlineId, status)
- `Booking`: (userId, status)
- `Booking`: (confirmationCode)
- `Itinerary`: (originIata, destinationIata, isActive)
- `User`: (email)
- `Airport`: (iataCode)
- `Airline`: (iataCode)

### Índices Compostos
- `Flight`: (originIata, destinationIata, date)
- `Booking`: (userId, createdAt)
- `Itinerary`: (type, isActive)

## Considerações de Implementação

### DynamoDB
- Usar tabelas separadas para cada entidade
- Implementar GSI (Global Secondary Indexes) para consultas complexas
- Usar composite keys para otimizar queries

### PostgreSQL/MySQL
- Implementar foreign keys para integridade referencial
- Usar índices para otimizar consultas de busca
- Implementar triggers para validações automáticas

### Cache
- Cachear aeroportos e companhias aéreas (dados estáticos)
- Cachear resultados de busca de voos por 5 minutos
- Cachear itinerários populares

## APIs Sugeridas

### Gestão de Usuários
- `POST /users` - Criar usuário
- `GET /users/:id` - Buscar usuário
- `PUT /users/:id` - Atualizar usuário
- `GET /users/:id/bookings` - Listar reservas do usuário

### Gestão de Voos
- `POST /flights` - Criar voo
- `GET /flights/search` - Buscar voos disponíveis
- `GET /flights/:id` - Detalhes do voo
- `PUT /flights/:id/status` - Atualizar status

### Gestão de Itinerários
- `POST /itineraries` - Criar itinerário
- `GET /itineraries/search` - Buscar itinerários
- `GET /itineraries/:id` - Detalhes do itinerário

### Gestão de Reservas
- `POST /bookings` - Criar reserva
- `GET /bookings/:id` - Detalhes da reserva
- `PUT /bookings/:id/confirm` - Confirmar reserva
- `PUT /bookings/:id/cancel` - Cancelar reserva
- `GET /bookings` - Listar reservas (com filtros)

### Relatórios
- `GET /reports/bookings` - Relatório de reservas
- `GET /reports/flights` - Relatório de voos
- `GET /reports/users` - Relatório de usuários 