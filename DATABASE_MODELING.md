# Modelagem do Banco de Dados - Sistema de Gestão de Viagens Corporativas

## Visão Geral

Este documento descreve a modelagem completa do banco de dados para o sistema de gestão de viagens corporativas, incluindo todas as entidades, relacionamentos e regras de negócio implementadas.

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

**Operações**:
- Criar usuário
- Buscar por ID
- Buscar por email
- Listar usuários

### 2. Airline (Companhia Aérea)
**Propósito**: Cadastrar companhias aéreas disponíveis no sistema

**Campos**:
- `id`: Identificador único (UUID)
- `name`: Nome da companhia aérea
- `iata_code`: Código IATA único (ex: "LA" para LATAM)
- `country`: País de origem
- `isActive`: Status ativo/inativo
- `createdAt`: Data de criação
- `updatedAt`: Data da última atualização

**Relacionamentos**:
- Uma companhia pode ter múltiplos voos (1:N com Flight)

**Operações**:
- Criar companhia aérea
- Buscar por ID
- Listar companhias
- Atualizar companhia
- Deletar companhia

### 3. Airport (Aeroporto)
**Propósito**: Cadastrar aeroportos e localidades

**Campos**:
- `id`: Identificador único (UUID)
- `name`: Nome completo do aeroporto
- `iata_code`: Código IATA único (ex: "GRU" para Guarulhos)
- `createdAt`: Data de criação
- `updatedAt`: Data da última atualização

**Relacionamentos**:
- Um aeroporto pode ser origem de múltiplos voos (1:N com Flight)
- Um aeroporto pode ser destino de múltiplos voos (1:N com Flight)

**Operações**:
- Criar aeroporto
- Buscar por ID
- Listar aeroportos
- Atualizar aeroporto
- Deletar aeroporto

### 4. Flight (Voo)
**Propósito**: Representar voos disponíveis

**Campos**:
- `id`: Identificador único (UUID)
- `flight_number`: Número do voo (ex: "LA3456")
- `airline_id`: Referência para Airline
- `origin_iata`: Código IATA do aeroporto de origem
- `destination_iata`: Código IATA do aeroporto de destino
- `departure_datetime`: Data/hora de partida (UTC)
- `arrival_datetime`: Data/hora de chegada (UTC)
- `frequency`: Array com dias da semana (0=Domingo, 1=Segunda, etc.)

**Métodos**:
- `operatesOn(dayOfWeek)`: Verifica se o voo opera em um dia específico
- `getDurationInMinutes()`: Calcula duração do voo em minutos

**Relacionamentos**:
- Pertence a uma Airline (N:1)
- Origem em um Airport (N:1)
- Destino em um Airport (N:1)
- Pode fazer parte de múltiplos Itineraries (N:M através de flightIds)

**Operações**:
- Criar voo
- Buscar por ID
- Listar voos com filtros
- Atualizar voo
- Deletar voo

### 5. Itinerary (Itinerário)
**Propósito**: Representar rotas de viagem compostas por múltiplos voos

**Campos**:
- `id`: Identificador único (UUID)
- `flight_ids`: Array ordenado com IDs dos voos
- `type`: Tipo de itinerário (ONE_WAY, ROUND_TRIP, MULTI_CITY)
- `origin_iata`: Código IATA de origem
- `destination_iata`: Código IATA de destino
- `totalDuration`: Duração total em minutos
- `totalPrice`: Preço total (opcional)
- `stops`: Número de paradas
- `isActive`: Status ativo/inativo
- `createdAt`: Data de criação
- `updatedAt`: Data da última atualização

**Relacionamentos**:
- Composto por múltiplos Flight (N:M através de flightIds)
- Pode ter múltiplas reservas (1:N com Booking)

**Operações**:
- Criar itinerário
- Buscar por ID
- Listar itinerários
- Deletar itinerário

### 6. Booking (Reserva)
**Propósito**: Gerenciar reservas de usuários

**Campos**:
- `id`: Identificador único (UUID)
- `user_id`: Referência para User
- `itinerary_id`: Referência para Itinerary
- `status`: Status da reserva (CONFIRMED, CANCELLED)
- `createdAt`: Data de criação
- `updatedAt`: Data da última atualização

**Relacionamentos**:
- Pertence a um User (N:1)
- Referencia um Itinerary (N:1)

**Operações**:
- Criar reserva
- Buscar por ID
- Listar reservas de usuário
- Cancelar reserva (soft delete)

## Diagrama de Relacionamentos

```
User (1) ──── (N) Booking (N) ──── (1) Itinerary
                                              │
                                              │ (N:M)
                                              ▼
Airline (1) ──── (N) Flight (N) ──── (1) Airport
```

## Enums e Tipos

### Gender (Gênero)
```sql
CREATE TYPE Gender AS ENUM ('MALE', 'FEMALE', 'OTHER');
```

### BookingStatus (Status da Reserva)
```sql
CREATE TYPE BookingStatus AS ENUM ('CONFIRMED', 'CANCELLED');
```

## Índices e Constraints

### Índices Únicos
- `users.email` - Email único por usuário
- `airlines.iata_code` - Código IATA único por companhia
- `airports.iata_code` - Código IATA único por aeroporto
- `flights.flight_number` - Número do voo único por companhia

### Índices de Performance
- `flights.airline_id` - Busca por companhia
- `flights.origin_iata` - Busca por origem
- `flights.destination_iata` - Busca por destino
- `flights.departure_datetime` - Busca por data
- `bookings.user_id` - Busca por usuário
- `bookings.itinerary_id` - Busca por itinerário

### Foreign Keys
- `flights.airline_id` → `airlines.id`
- `flights.origin_iata` → `airports.iata_code`
- `flights.destination_iata` → `airports.iata_code`
- `bookings.user_id` → `users.id`
- `bookings.itinerary_id` → `itineraries.id`

## Regras de Negócio

### 1. Validação de Voos
- **Origem e Destino**: Não podem ser iguais
- **Datas**: Partida deve ser anterior à chegada
- **Frequência**: Array válido de dias da semana (0-6)
- **Companhia**: Deve existir no sistema
- **Aeroportos**: Devem existir no sistema

### 2. Validação de Itinerários
- **Voos**: Array não pode estar vazio
- **Sequência**: Voos devem formar rota válida
- **Tempo**: Intervalo adequado entre voos (mínimo 30 min)
- **Origem**: Primeiro voo define origem
- **Destino**: Último voo define destino

### 3. Validação de Reservas
- **Usuário**: Deve existir no sistema
- **Itinerário**: Deve existir no sistema
- **Duplicação**: Usuário não pode ter reserva duplicada
- **Status**: Inicialmente CONFIRMED

### 4. Validação de Usuários
- **Email**: Formato válido e único
- **Senha**: Mínimo 6 caracteres, criptografada
- **Nome**: Mínimo 2 caracteres
- **Gênero**: Valor válido do enum

## Migrações Implementadas

### 1. Migração Inicial
```sql
-- Criação das tabelas principais
CREATE TABLE users (...);
CREATE TABLE airlines (...);
CREATE TABLE airports (...);
CREATE TABLE flights (...);
CREATE TABLE itineraries (...);
CREATE TABLE bookings (...);
```

### 2. Ajuste de User
```sql
-- Adição de campos de timestamp
ALTER TABLE users ADD COLUMN createdAt TIMESTAMP DEFAULT NOW();
ALTER TABLE users ADD COLUMN updatedAt TIMESTAMP DEFAULT NOW();
```

### 3. Adição de Modelos de Viagem
```sql
-- Criação das tabelas de viagem
CREATE TABLE airlines (...);
CREATE TABLE airports (...);
CREATE TABLE flights (...);
CREATE TABLE itineraries (...);
```

### 4. Adição de Timestamps em Booking
```sql
-- Adição de campos de timestamp em bookings
ALTER TABLE bookings ADD COLUMN createdAt TIMESTAMP DEFAULT NOW();
ALTER TABLE bookings ADD COLUMN updatedAt TIMESTAMP DEFAULT NOW();
```

## Queries de Exemplo

### 1. Buscar Voos por Origem e Destino
```sql
SELECT f.*, a.name as airline_name, 
       o.name as origin_name, d.name as destination_name
FROM flights f
JOIN airlines a ON f.airline_id = a.id
JOIN airports o ON f.origin_iata = o.iata_code
JOIN airports d ON f.destination_iata = d.iata_code
WHERE f.origin_iata = 'GRU' 
  AND f.destination_iata = 'JFK'
  AND f.departure_datetime >= '2024-02-15'
ORDER BY f.departure_datetime;
```

### 2. Buscar Itinerários com Voos
```sql
SELECT i.*, 
       json_agg(f.*) as flights
FROM itineraries i
JOIN unnest(i.flight_ids) WITH ORDINALITY AS flight_id(id, ord)
JOIN flights f ON f.id = flight_id.id
WHERE i.origin_iata = 'GRU' 
  AND i.destination_iata = 'JFK'
GROUP BY i.id
ORDER BY i.departure_datetime;
```

### 3. Buscar Reservas de Usuário
```sql
SELECT b.*, i.*, u.name as user_name
FROM bookings b
JOIN itineraries i ON b.itinerary_id = i.id
JOIN users u ON b.user_id = u.id
WHERE b.user_id = 'user-uuid'
  AND b.status = 'CONFIRMED'
ORDER BY b.createdAt DESC;
```

### 4. Buscar Disponibilidade
```sql
SELECT i.*, COUNT(f.id) as flight_count
FROM itineraries i
JOIN unnest(i.flight_ids) AS flight_id(id)
JOIN flights f ON f.id = flight_id.id
WHERE i.origin_iata = 'GRU'
  AND i.destination_iata = 'JFK'
  AND DATE(i.departure_datetime) = '2024-02-15'
  AND i.stops <= 1
GROUP BY i.id
HAVING COUNT(f.id) > 0
ORDER BY i.departure_datetime;
```

## Performance e Otimizações

### 1. Índices Estratégicos
- Índices em campos de busca frequente
- Índices compostos para queries complexas
- Índices parciais para dados ativos

### 2. Particionamento
- Tabela de voos por data (futuro)
- Tabela de reservas por usuário (futuro)

### 3. Cache
- Cache de aeroportos e companhias
- Cache de itinerários populares
- Cache de disponibilidade

## Segurança

### 1. Dados Sensíveis
- Senhas sempre criptografadas (bcrypt)
- Tokens JWT para autenticação
- Validação de entrada em todas as operações

### 2. Controle de Acesso
- Middleware de autenticação
- Validação de propriedade (usuário só acessa seus dados)
- Logs de auditoria (futuro)

## Monitoramento

### 1. Métricas Importantes
- Número de reservas por período
- Taxa de cancelamento
- Tempo médio de resposta das queries
- Uso de recursos do banco

### 2. Alertas
- Queries lentas
- Erros de constraint
- Espaço em disco
- Conexões simultâneas

## Próximos Passos

### 1. Melhorias de Performance
- Implementar cache Redis
- Otimizar queries complexas
- Adicionar índices específicos

### 2. Funcionalidades Futuras
- Histórico de preços
- Sistema de notificações
- Relatórios avançados
- Backup automático

### 3. Escalabilidade
- Sharding por região
- Read replicas
- Microserviços por domínio