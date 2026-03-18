# Cashier App

Aplikasi kasir berbasis web untuk cafe.

## Cara Run dengan Docker

### Kebutuhan

**Linux (Fedora/Ubuntu/Arch)**
- Docker
- Docker Compose

**Windows**
- [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)
- Pastikan WSL2 sudah aktif

**Mac**
- [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop/)

### Langkah ( Sama ntuk semua OS
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
   ada di dalam file backend buat .env dlu
   npm run dev

### Frontend
   cd frontend
   npm install
   npm run dev

## Default Login
| Role | Email | Password |
|------|-------|----------|
| Owner | owner@cafe.com | password123 |
| Manager | manager@cafe.com | cashier |
| Cashier | cashier@cafe.com | cashier |


## Tech Stack
- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Database:** PostgreSQL
- **Auth:** JWT
```

---

### Khusus Windows — tambahkan note di `docker-compose.yml`:

Kalau teman Windows mengalami masalah line ending, tambahkan file `.gitattributes` di root:
```
* text=auto
*.sh text eol=lf
Dockerfile text eol=lf
