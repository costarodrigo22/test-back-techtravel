import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('senha123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'recrutador@teste.com' },
    update: {},
    create: {
      name: 'Recrutador',
      email: 'recrutador@teste.com',
      password,
      gender: 'MALE',
    },
  });

  const airline = await prisma.airline.upsert({
    where: { iata_code: 'TT' },
    update: {},
    create: {
      name: 'TechTravel Airlines',
      iata_code: 'TT',
    },
  });

  const airport = await prisma.airport.upsert({
    where: { iata_code: 'GRU' },
    update: {},
    create: {
      name: 'Aeroporto de Guarulhos',
      iata_code: 'GRU',
    },
  });

  const airport2 = await prisma.airport.upsert({
    where: { iata_code: 'JFK' },
    update: {},
    create: {
      name: 'John F. Kennedy International',
      iata_code: 'JFK',
    },
  });

  const flight = await prisma.flight.create({
    data: {
      flight_number: 'TT1001',
      airline_id: airline.id,
      origin_iata: 'GRU',
      destination_iata: 'JFK',
      departure_datetime: new Date('2024-07-10T10:00:00Z'),
      arrival_datetime: new Date('2024-07-10T18:00:00Z'),
      frequency: [3],
    },
  });

  const itinerary = await prisma.itinerary.create({
    data: {
      flight_ids: [flight.id],
      origin_iata: 'GRU',
      destination_iata: 'JFK',
      type: 'ONE_WAY',
      totalDuration: 480,
      stops: 0,
      isActive: true,
    },
  });

  await prisma.booking.create({
    data: {
      user_id: user.id,
      itinerary_id: itinerary.id,
      status: 'CONFIRMED',
    },
  });

  console.log('Seed concluído! Usuário recrutador: recrutador@teste.com | senha: senha123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect()); 