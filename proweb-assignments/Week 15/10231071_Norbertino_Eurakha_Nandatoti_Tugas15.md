# Laporan Progres Mingguan - SIPLA
**Kelompok**: 4
**Anggota** : 
- Alsha Dwi Cahya 10231011
- Muhammad Aqila Ardhi 10231057
- Nanda Aulia Putri 10231067
- Norbertino Eurakha Nandatoti 101231071

**Mitra**: TQ1
**Pekan ke-**: [15]
**Tanggal**: [23/05/2025]

## Progress Summary
Pada pekan ini, kami telah membuat kemajuan yang signifikan dalam pengembangan Sistem Informasi Pemesanan Lapangan Olahraga (SIPLA). Kami telah mengembangkan beberapa endpoint API yang memungkinkan akses ke data dari database, seperti endpoint untuk mengambil data lapangan, data pengguna, dan data pemesanan. Selain itu, kami juga telah membuat beberapa halaman web yang dapat diakses oleh pengguna, seperti halaman utama, halaman pemesanan, dan halaman profil pengguna.


Selain itu, kami juga telah melakukan pengujian terhadap beberapa fitur yang telah dikembangkan, seperti fitur pemesanan dan fitur profil pengguna. Hasil pengujian menunjukkan bahwa fitur-fitur tersebut dapat berjalan dengan lancar dan sesuai dengan kebutuhan pengguna.

Dalam keseluruhan, kami telah membuat kemajuan yang signifikan dalam pengembangan SIPLA pada pekan ini. Kami akan terus mengembangkan dan memperbaiki sistem ini agar dapat memenuhi kebutuhan pengguna dan mitra.

## Accomplished Tasks

- Mengembangkan beberapa endpoint API untuk mengakses data dari database, seperti endpoint untuk mengambil data lapangan, data pengguna, dan data pemesanan.
- Mengembangkan beberapa halaman web yang dapat diakses oleh pengguna, seperti halaman utama, halaman pemesanan, dan halaman profil pengguna.
- Mengembangkan desain ERD untuk database SIPLA yang lebih komprehensif.
- Melakukan pengujian terhadap beberapa fitur yang telah dikembangkan, seperti fitur pemesanan dan fitur profil pengguna.

## Challenges & Solutions
- **Challenge 1**: Mengintegrasikan endpoint API dengan database untuk mengakses data lapangan, pengguna, dan pemesanan.
  - **Solution**: Menggunakan framework Express.js untuk menghubungkan endpoint API dengan database MySQL, serta mengimplementasikan query yang sesuai untuk mengambil data yang diperlukan.
- **Challenge 2**: Mengembangkan halaman web yang dapat diakses oleh pengguna untuk melakukan pemesanan lapangan dan melihat profil pengguna.
  - **Solution**: Menggunakan React.js untuk mengembangkan halaman web yang responsif dan mudah digunakan, serta mengintegrasikan halaman web dengan endpoint API yang telah dikembangkan untuk mengambil data yang diperlukan.

## Next Week Plan
- Mengoptimalkan kinerja sistem dengan memperbaiki bug yang masih terdapat.
- Menyelesaikan fitur umpan balik dan pesan untuk meningkatkan pengalaman pengguna.
- Mengembangkan fitur notifikasi untuk pemesanan dan perubahan status lapangan.
- Mengintegrasikan sistem pembayaran online untuk memudahkan transaksi.

## Contributions
- **[Alsha Dwi Cahya]**: Menjelaskan dokumentasi dokumen SIPLA.
- **[Muhammad Aqila Ardhi]**: Melakukan DEMO ke Mitra Terkiat.
- **[Nanda Aulia Putri]**: Menjelaskan terkait sistematis pada SIPLA.
- **[Norbertino Eurakha Nandatoti]**: Merancang dan Membangun halaman web untuk SIPLA.

# Dokumentasi MD

```
# TQ1 Sports Field Booking System (SIPLA)

![TQ1 Sports Field Booking System](/frontend/public/images/hero-bg.jpg)

TQ1 Sports Field Booking System adalah aplikasi berbasis web yang memungkinkan pengguna untuk melakukan pemesanan lapangan olahraga (futsal dan badminton) secara online. Sistem ini dibangun menggunakan React untuk frontend dan Express.js untuk backend, dengan antarmuka yang modern dan responsif.

## Fitur Utama

### Pengguna
- 🏆 Antarmuka modern dengan landing page yang informatif
- 🔍 Pemesanan lapangan tanpa perlu login
- ⚽ Pemilihan jenis lapangan (Futsal/Badminton)
- 📅 Cek ketersediaan lapangan secara real-time
- 🌟 Sistem membership dengan harga khusus
- 💬 Pemberian kritik dan saran melalui form kontak
- 🧾 Mendapatkan nota pemesanan

### Member
- 👤 Registrasi dan login member
- 💰 Harga khusus untuk member

### Admin
- 📊 Dashboard admin dengan statistik
- 📝 Manajemen pemesanan lapangan
- 👥 Pengelolaan data member
- 🏟️ Manajemen data lapangan dan jadwal
- 📈 Akses statistik transaksi dan laporan
- 📬 Pengelolaan kritik dan saran

## Teknologi yang Digunakan

### Frontend
- **React.js** - Library JavaScript untuk membangun UI
- **Vite** - Build tool yang cepat
- **React Router DOM** - Manajemen routing
- **Axios** - HTTP client untuk API requests
- **Bootstrap 5** - Framework CSS untuk styling
- **Font Awesome** - Ikon dan grafis
- **Google Fonts (Poppins)** - Typography

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MySQL** - Database relasional
- **JWT** - Autentikasi admin dan member
- **Cors** - Middleware untuk cross-origin requests
- **Multer** - Upload file dan gambar
- **Nodemailer** - Pengiriman email konfirmasi

## Desain UI/UX

TQ1 Sports Field Booking System menggunakan desain modern yang terinspirasi dari template Gymso Fitness dengan:

- **Warna Utama**: Merah (#f13a11) - Energi dan semangat olahraga
- **Warna Sekunder**: Biru (#3498db) - Profesionalisme dan kepercayaan
- **Font**: Poppins - Modern, bersih, dan mudah dibaca
- **Komponen**: 
  - Navbar horizontal dengan efek scroll
  - Hero section dengan background image
  - Sections untuk About, Fields, Schedule, dan Contact
  - Form booking yang user-friendly
  - Dashboard admin dan member yang intuitif

## Struktur Proyek

SIPLA/
├── frontend/                  # React frontend
│   ├── src/
│   │   ├── assets/            # CSS, JS, dan gambar
│   │   │   ├── css/           # File CSS
│   │   │   │   ├── tq1-landing.css  # Styling landing page
│   │   │   ├── js/            # JavaScript files
│   │   │   │   ├── tq1-scripts.js   # Script untuk navbar dan efek
│   │   ├── components/        # Komponen reusable
│   │   │   ├── Navbar.jsx     # Komponen navbar
│   │   │   ├── ProtectedRoute.jsx  # Route dengan autentikasi
│   │   ├── pages/             # Halaman aplikasi
│   │   │   ├── Home.jsx       # Landing page
│   │   │   ├── BookingForm.jsx # Form pemesanan
│   │   │   ├── admin/         # Halaman admin
│   │   │   ├── member/        # Halaman member
│   │   ├── App.jsx            # Router utama
│   │   └── main.jsx           # Entry point
│   ├── public/                # Asset publik
│   │   ├── images/            # Gambar
│   └── package.json
│
└── backend/                   # Express backend
    ├── src/
    │   ├── controllers/       # Logic controller
    │   │   ├── bookingController.js
    │   │   ├── adminController.js
    │   │   ├── memberController.js
    │   ├── models/            # Model database
    │   ├── routes/            # API routes
    │   │   ├── adminRoutes.js
    │   │   ├── bookingRoutes.js
    │   │   ├── memberRoutes.js
    │   ├── middleware/        # Middleware
    │   │   ├── auth.js        # Autentikasi
    │   ├── config/            # Konfigurasi
    │   │   ├── db.js          # Koneksi database
    │   └── app.js             # Setup Express
    └── package.json


## Instalasi dan Pengembangan

### Prasyarat
- Node.js (versi 14 atau lebih tinggi)
- MySQL
- Git

### Langkah Instalasi

1. Clone repositori
```bash
git clone https://github.com/username/SIPLA.git
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
- Import struktur database dari file SQL yang disediakan di `backend/database/sipla_db.sql`
- Konfigurasi koneksi database di backend

### Environment Variables

#### Frontend (.env)

VITE_API_URL=http://localhost:3000/api
VITE_ADMIN_URL=http://localhost:3000/api/admin
VITE_MEMBER_URL=http://localhost:3000/api/member


#### Backend (.env)

PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=sipla_db
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password


## API Endpoints

### Public
- `GET /api/fields` - Mendapatkan semua lapangan
- `GET /api/fields/:id` - Mendapatkan detail lapangan
- `GET /api/schedule/:fieldId/:date` - Cek jadwal lapangan
- `POST /api/booking` - Membuat pemesanan baru
- `POST /api/contact` - Mengirim pesan kontak

### Member
- `POST /api/member/register` - Registrasi member baru
- `POST /api/member/login` - Login member
- `GET /api/member/bookings` - Riwayat pemesanan member
- `GET /api/member/profile` - Profil member
- `PUT /api/member/profile` - Update profil member

### Admin
- `POST /api/admin/login` - Login admin
- `GET /api/admin/dashboard` - Data dashboard
- `GET /api/admin/bookings` - Semua pemesanan
- `PUT /api/admin/bookings/:id` - Update status pemesanan
- `GET /api/admin/members` - Data semua member
- `GET /api/admin/fields` - Manajemen lapangan
- `POST /api/admin/fields` - Tambah lapangan baru
- `PUT /api/admin/fields/:id` - Update data lapangan

## Database Schema

### Tabel `fields`
- `id` - Primary key
- `name` - Nama lapangan
- `type` - Jenis (futsal, badminton, basket)
- `price` - Harga per jam
- `member_price` - Harga khusus member
- `image` - Gambar lapangan
- `description` - Deskripsi

### Tabel `bookings`
- `id` - Primary key
- `field_id` - Foreign key ke fields
- `member_id` - Foreign key ke members (nullable)
- `customer_name` - Nama pemesan
- `customer_phone` - Nomor telepon
- `customer_email` - Email
- `booking_date` - Tanggal pemesanan
- `start_time` - Waktu mulai
- `end_time` - Waktu selesai
- `total_price` - Total harga
- `status` - Status (pending, confirmed, cancelled, completed)
- `payment_status` - Status pembayaran
- `created_at` - Waktu pembuatan

### Tabel `members`
- `id` - Primary key
- `name` - Nama member
- `email` - Email (unique)
- `password` - Password (hashed)
- `phone` - Nomor telepon
- `join_date` - Tanggal bergabung
- `status` - Status (active, inactive)

### Tabel `admins`
- `id` - Primary key
- `username` - Username admin
- `password` - Password (hashed)
- `name` - Nama admin
- `email` - Email admin

## Alur Pengembangan

1. Frontend
   - Setup komponen dasar dan routing
   - Implementasi landing page dengan template Gymso Fitness
   - Pembuatan form pemesanan dan validasi
   - Integrasi dengan API backend
   - Implementasi dashboard admin dan member

2. Backend
   - Setup Express dan middleware
   - Pembuatan struktur database dan relasi
   - Implementasi API endpoints untuk booking, member, dan admin
   - Sistem autentikasi dengan JWT
   - Validasi data dan error handling

3. Testing & Deployment
   - Unit testing komponen React
   - API testing dengan Postman
   - Deployment ke hosting (Heroku, Vercel, dll)

## Screenshots

| Landing Page | Booking Form | Admin Dashboard |
|--------------|--------------|-----------------|
| ![Landing Page](/screenshots/landing-page.png) | ![Booking Form](/screenshots/booking-form.png) | ![Admin Dashboard](/screenshots/admin-dashboard.png) |

## Kontribusi
Silakan berkontribusi dengan membuat pull request. Untuk perubahan besar, harap buka issue terlebih dahulu untuk mendiskusikan perubahan yang diinginkan.

## Lisensi
[MIT License](LICENSE)

## Penghargaan
- Icon dari [Font Awesome](https://fontawesome.com)
- Font dari [Google Fonts](https://fonts.google.com)
```


## Link Ppt
- [Link Ppt](https://www.canva.com/design/DAGmfg_RXM8/4VTToIg_n-Zqqni6uD6q8Q/edit)

