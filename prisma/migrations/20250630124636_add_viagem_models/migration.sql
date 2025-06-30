-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('CONFIRMED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Airline" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "iata_code" TEXT NOT NULL,

    CONSTRAINT "Airline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Airport" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "iata_code" TEXT NOT NULL,

    CONSTRAINT "Airport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Flight" (
    "id" TEXT NOT NULL,
    "flight_number" TEXT NOT NULL,
    "airline_id" TEXT NOT NULL,
    "origin_iata" TEXT NOT NULL,
    "destination_iata" TEXT NOT NULL,
    "departure_datetime" TIMESTAMP(3) NOT NULL,
    "arrival_datetime" TIMESTAMP(3) NOT NULL,
    "frequency" INTEGER[],

    CONSTRAINT "Flight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Itinerary" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Itinerary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItineraryFlight" (
    "id" TEXT NOT NULL,
    "itineraryId" TEXT NOT NULL,
    "flightId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "ItineraryFlight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "itinerary_id" TEXT NOT NULL,
    "status" "BookingStatus" NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Airline_iata_code_key" ON "Airline"("iata_code");

-- CreateIndex
CREATE UNIQUE INDEX "Airport_iata_code_key" ON "Airport"("iata_code");

-- CreateIndex
CREATE UNIQUE INDEX "ItineraryFlight_itineraryId_order_key" ON "ItineraryFlight"("itineraryId", "order");

-- AddForeignKey
ALTER TABLE "Flight" ADD CONSTRAINT "Flight_airline_id_fkey" FOREIGN KEY ("airline_id") REFERENCES "Airline"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flight" ADD CONSTRAINT "Flight_origin_iata_fkey" FOREIGN KEY ("origin_iata") REFERENCES "Airport"("iata_code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flight" ADD CONSTRAINT "Flight_destination_iata_fkey" FOREIGN KEY ("destination_iata") REFERENCES "Airport"("iata_code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItineraryFlight" ADD CONSTRAINT "ItineraryFlight_itineraryId_fkey" FOREIGN KEY ("itineraryId") REFERENCES "Itinerary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItineraryFlight" ADD CONSTRAINT "ItineraryFlight_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "Flight"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_itinerary_id_fkey" FOREIGN KEY ("itinerary_id") REFERENCES "Itinerary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
