# Cashier App

Aplikasi kasir berbasis web untuk cafe.

## Cara Run dengan Docker

### Kebutuhan
- Docker
- Docker Compose

### Langkah
1. Clone repo
   git clone https://github.com/Rudheus/react-cashier-webapp.git
   cd react-cashier-webapp

2. Jalankan semua service
   docker-compose up

3. Buka browser
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## Cara Run Manual

### Kebutuhan
- Node.js v20+
- PostgreSQL
- npm

### Backend
   cd backend
   npm install
   cp .env.example .env
   # Edit .env sesuai database kamu
   npm run dev

### Frontend
   cd frontend
   npm install
   npm run dev
