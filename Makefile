install:
	npm install

db-up:
	docker-compose up -d

migrate:
	npm run prisma:migrate

generate:
	npm run prisma:generate

dev:
	npm run dev

test:
	npm test

setup: install db-up migrate generate

down:
	docker-compose down

# Popula o banco de dados com dados iniciais
seed:
	npm run prisma:seed 