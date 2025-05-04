# Sistem Informasi Pemesanan Lapangan (SIPLA)

Sistem Informasi Pemesanan Lapangan adalah aplikasi berbasis web yang memungkinkan pengguna untuk melakukan pemesanan lapangan olahraga (futsal dan bulutangkis) secara online. Sistem ini dibangun menggunakan React untuk frontend dan Express.js untuk backend.

## Fitur Utama

### Pengguna
- Pemesanan lapangan tanpa perlu login
- Pemilihan jenis lapangan (Futsal/Bulutangkis)
- Cek ketersediaan lapangan
- Sistem membership khusus lapangan bulutangkis
- Pemberian kritik dan saran
- Mendapatkan nota pemesanan

### Admin
- Dashboard admin
- Manajemen pemesanan lapangan
- Pengelolaan data member (khusus bulutangkis)
- Manajemen data lapangan
- Akses statistik transaksi
- Pengelolaan kritik dan saran

## Teknologi yang Digunakan

### Frontend
- React.js
- Vite (build tool)
- React Router DOM (routing)
- Axios (HTTP client)
- Tailwind CSS (styling)

### Backend
- Node.js
- Express.js
- MySQL (database)
- JWT (autentikasi admin)
- Cors (middleware)

## Struktur Proyek
```
SIPLA/
├── frontend/          # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
│
└── backend/           # Express backend
    ├── src/
    ├── config/
    └── package.json
```

## Instalasi dan Pengembangan

### Prasyarat
- Node.js (versi 14 atau lebih tinggi)
- MySQL
- Git

### Langkah Instalasi

1. Clone repositori
```bash
git clone [url-repositori]
cd SIPLA
```

2. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

3. Setup Backend
```bash
cd backend
npm install
node index.js
```

4. Setup Database
- Buat database MySQL baru
- Import struktur database dari file SQL yang disediakan
- Konfigurasi koneksi database di backend

### Environment Variables

#### Frontend (.env)
```
VITE_API_URL=http://localhost:3000
```

#### Backend (.env)
```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=sipla_db
JWT_SECRET=your_secret_key
```

## Alur Pengembangan

1. Frontend
   - Setup komponen dasar
   - Implementasi routing
   - Pembuatan form pemesanan
   - Integrasi dengan API
   - Implementasi dashboard admin

2. Backend
   - Setup Express dan middleware
   - Pembuatan struktur database
   - Implementasi API endpoints
   - Sistem autentikasi admin
   - Validasi data

3. Database
   - Perancangan skema
   - Relasi antar tabel
   - Optimasi query

## Kontribusi
Silakan berkontribusi dengan membuat pull request. Untuk perubahan besar, harap buka issue terlebih dahulu untuk mendiskusikan perubahan yang diinginkan.

## Lisensi
[MIT License](LICENSE) 