# ☕ Cafe Cashier App

Aplikasi kasir berbasis web untuk cafe dengan fitur manajemen menu, inventori, laporan penjualan, dan role-based access control.

## Fitur

- Login dengan role berbeda (Owner, Manager, Cashier)
- Menu produk dengan kategori dan stok
- Keranjang belanja & checkout
- Pilihan metode pembayaran (Cash, Card, QRIS, Transfer)
- Struk digital setelah transaksi
- Manajemen staff oleh Owner
- Laporan & export penjualan (CSV)

---

## Cara Run dengan Docker (Recommended)

Docker adalah aplikasi yang memungkinkan kamu menjalankan aplikasi ini tanpa perlu install Node.js, PostgreSQL, atau konfigurasi apapun secara manual. Cukup install Docker, lalu jalankan satu perintah.

---

### Install Docker

#### Windows 11

WSL2 sudah tersedia secara default di Windows 11, tidak perlu install manual.

1. Download Docker Desktop di:
   👉 https://www.docker.com/products/docker-desktop/

2. Jalankan installer yang sudah didownload, ikuti langkah berikut:
   - Klik **Accept** pada license agreement
   - Centang **Use WSL 2 instead of Hyper-V**
   - Klik **Ok** dan tunggu instalasi selesai
   - Klik **Close and restart** — komputer akan restart otomatis

3. Setelah restart, buka **Docker Desktop** dari Start Menu

4. Tunggu hingga muncul tulisan **"Engine running"** di pojok kiri bawah aplikasi — ini tandanya Docker sudah siap dipakai

5. Verifikasi di PowerShell — tekan `Windows + X` → pilih **Terminal** lalu jalankan:
```powershell
   docker --version
   docker-compose --version
```
   Harusnya muncul versi Docker dan Docker Compose.

---

#### Mac

1. Download Docker Desktop di:
   👉 https://www.docker.com/products/docker-desktop/

2. Pilih sesuai chip kamu:
   - **Apple Silicon** → untuk Mac dengan chip M1/M2/M3
   - **Intel** → untuk Mac dengan chip Intel

3. Buka file `.dmg` yang sudah didownload, drag icon Docker ke folder **Applications**

4. Buka **Docker Desktop** dari Applications — tunggu hingga icon Docker di menu bar berhenti berputar

5. Verifikasi di Terminal:
```bash
   docker --version
   docker-compose --version
```

---

#### Linux — Fedora
```bash
sudo dnf install docker docker-compose -y
sudo systemctl enable docker
sudo systemctl start docker

# Supaya tidak perlu sudo setiap pakai Docker
sudo usermod -aG docker $USER
newgrp docker

# Verifikasi
docker --version
docker-compose --version
```

#### Linux — Ubuntu/Debian
```bash
sudo apt update
sudo apt install docker.io docker-compose -y
sudo systemctl enable docker
sudo systemctl start docker

sudo usermod -aG docker $USER
newgrp docker

docker --version
```

#### Linux — Arch
```bash
sudo pacman -S docker docker-compose
sudo systemctl enable docker
sudo systemctl start docker

sudo usermod -aG docker $USER
newgrp docker

docker --version
```

---

### Jalankan Aplikasi

Setelah Docker terinstall dan berjalan, ikuti langkah berikut:

**1. Clone repo**

Buka terminal (atau PowerShell di Windows), lalu jalankan:
```bash
git clone https://github.com/Rudheus/react-cashier-webapp.git
```

Masuk ke folder project:
```bash
cd react-cashier-webapp
```

**2. Jalankan aplikasi**
```bash
docker-compose up --build
```

Pertama kali akan membutuhkan waktu beberapa menit karena mengunduh dependencies. Tunggu hingga muncul pesan seperti ini:
```
backend-1  | Connected to the database
frontend-1 | VITE v8.0.0 ready in 300ms
frontend-1 | Local: http://localhost:5173/
```

**3. Buka browser**

| Halaman | URL |
|---------|-----|
| Aplikasi | http://localhost:5173 |
| API Backend | http://localhost:3000/api/ping |

**4. Untuk menghentikan aplikasi**
```bash
# Tekan Ctrl+C di terminal
# Atau jalankan perintah ini di terminal baru:
docker-compose down
```

---

## Cara Run Manual (Tanpa Docker)

Gunakan cara ini jika kamu ingin mengembangkan atau memodifikasi aplikasi.

### Kebutuhan
- Node.js v20+ → https://nodejs.org
- PostgreSQL → https://www.postgresql.org
- npm (sudah termasuk dengan Node.js)

> Buka **2 terminal terpisah** — satu untuk backend, satu untuk frontend.

### Terminal 1 — Backend
```bash
# Clone repo (skip jika sudah)
git clone https://github.com/Rudheus/react-cashier-webapp.git

# Masuk ke folder backend
cd react-cashier-webapp/backend

# Install dependencies
npm install

# Salin file konfigurasi
cp .env.example .env
```

Buka file `.env` dan sesuaikan dengan konfigurasi PostgreSQL kamu:
```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cashier_db
DB_USER=cashier_user
DB_PASSWORD=password_kamu
JWT_SECRET=bebas_isi_apa_saja
```

Jalankan backend:
```bash
npm run dev
```

### Terminal 2 — Frontend
```bash
# Masuk ke folder frontend
cd react-cashier-webapp/frontend

# Install dependencies
npm install

# Jalankan frontend
npm run dev
```

Buka browser di http://localhost:5173

---

## Default Login

Akun ini otomatis dibuat saat pertama kali aplikasi dijalankan.

| Role | Email | Password |
|------|-------|----------|
| Owner | owner@cafe.com | password123 |
| Manager | manager@cafe.com | password123 |
| Cashier | cashier@cafe.com | password123 |

> **Penting:** Segera ganti password setelah login pertama kali melalui menu profile.

---

## Struktur Project
```
cashier-app/
├── backend/              # Node.js + Express API
│   ├── src/
│   │   ├── routes/       # Auth, Products, Orders, Users, Exports
│   │   ├── middleware/   # JWT Authentication
│   │   └── db/           # Schema, Seed, Database connection
│   └── Dockerfile
├── frontend/             # React + Vite
│   ├── src/
│   │   ├── pages/        # Login, Setup, Cashier, Manager, Owner
│   │   ├── components/   # Navbar, PaymentModal, Receipt
│   │   └── services/     # Axios API config
│   └── Dockerfile
└── docker-compose.yml
```

---

## Tech Stack

| Bagian | Teknologi |
|--------|-----------|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| Auth | JWT + Bcrypt |
| Containerization | Docker + Docker Compose |

---

## Developer

Developed by [Rudheus](https://github.com/Rudheus)