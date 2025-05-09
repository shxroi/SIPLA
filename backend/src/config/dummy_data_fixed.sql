-- Data Dummy untuk Dashboard TQ1 Sports Field Booking System

-- Reset data (hapus data yang ada)
DELETE FROM booking_history;
DELETE FROM booking_event;
DELETE FROM booking;
DELETE FROM member;
DELETE FROM lapangan;
DELETE FROM admin WHERE username != 'admin'; -- Jangan hapus admin utama

-- Insert Admin (jika belum ada)
INSERT INTO admin (username, password, no_hp, email)
SELECT 'admin', 'admin123', '081234567890', 'admin@tq1sports.com'
WHERE NOT EXISTS (SELECT 1 FROM admin WHERE username = 'admin');

-- Insert Lapangan dengan ID eksplisit
INSERT INTO lapangan (id, nama, tipe, status, jenis_lapangan, nomor_lapangan) VALUES
(1, 'Lapangan Futsal A', 'futsal', 'tersedia', 'futsal', 1),
(2, 'Lapangan Futsal B', 'futsal', 'tersedia', 'futsal', 2),
(3, 'Lapangan Futsal C', 'futsal', 'maintenance', 'futsal', 3),
(4, 'Lapangan Badminton 1', 'bulutangkis', 'tersedia', 'bulutangkis', 1),
(5, 'Lapangan Badminton 2', 'bulutangkis', 'tersedia', 'bulutangkis', 2),
(6, 'Lapangan Badminton 3', 'bulutangkis', 'tersedia', 'bulutangkis', 3),
(7, 'Lapangan Badminton 4', 'bulutangkis', 'maintenance', 'bulutangkis', 4);

-- Insert Member dengan ID eksplisit
INSERT INTO member (id, nama, no_telepon, lapangan_id, tanggal_mulai, tanggal_berakhir, jam_sewa, status, jenis_membership) VALUES
(1, 'Budi Santoso', '081234567891', 4, '2025-04-01', '2025-07-01', '19:00', 'aktif', 'bulanan'),
(2, 'Dewi Lestari', '081234567892', 4, '2025-04-10', '2025-07-10', '19:00', 'aktif', 'bulanan'),
(3, 'Eko Prasetyo', '081234567893', 5, '2025-03-15', '2025-06-15', '19:00', 'aktif', 'bulanan'),
(4, 'Fitri Handayani', '081234567894', 5, '2025-02-20', '2025-05-20', '19:00', 'aktif', 'bulanan'),
(5, 'Gunawan Wibowo', '081234567895', 6, '2025-01-05', '2025-04-05', '19:00', 'expired', 'bulanan'),
(6, 'Hani Susanti', '081234567896', 6, '2025-01-10', '2025-04-10', '19:00', 'expired', 'bulanan'),
(7, 'Irfan Hakim', '081234567897', 4, '2025-04-20', '2025-07-20', '19:00', 'aktif', 'bulanan'),
(8, 'Joko Widodo', '081234567898', 5, '2025-04-25', '2025-07-25', '19:00', 'aktif', 'bulanan');

-- Insert Booking Regular (Futsal) dengan ID eksplisit
INSERT INTO booking (id, lapangan_id, nama_pemesan, no_telepon, tanggal, jam_mulai, jam_selesai, tipe_booking, total_harga, catatan, status_booking, status_pembayaran, jenis_booking_detail) VALUES
-- Hari ini
(1, 1, 'Ahmad Rizal', '081234567899', CURRENT_DATE, '08:00', '10:00', 'regular', 150000, 'Booking regular pagi', 'confirmed', 'lunas', 'sekali_pinjam'),
(2, 2, 'Bayu Pratama', '081234567800', CURRENT_DATE, '13:00', '15:00', 'regular', 200000, 'Booking regular siang', 'confirmed', 'lunas', 'sekali_pinjam'),
(3, 1, 'Candra Wijaya', '081234567801', CURRENT_DATE, '18:00', '20:00', 'regular', 250000, 'Booking regular malam', 'pending', 'belum_bayar', 'sekali_pinjam'),
-- Kemarin
(4, 2, 'Dodi Sudrajat', '081234567802', CURRENT_DATE - INTERVAL '1 day', '08:00', '10:00', 'regular', 150000, 'Booking regular pagi', 'confirmed', 'lunas', 'sekali_pinjam'),
(5, 1, 'Edi Sumarno', '081234567803', CURRENT_DATE - INTERVAL '1 day', '13:00', '15:00', 'regular', 200000, 'Booking regular siang', 'confirmed', 'lunas', 'sekali_pinjam'),
-- 2 hari lalu
(6, 2, 'Faisal Akbar', '081234567804', CURRENT_DATE - INTERVAL '2 day', '18:00', '20:00', 'regular', 250000, 'Booking regular malam', 'confirmed', 'lunas', 'sekali_pinjam'),
-- Besok
(7, 1, 'Galih Pratama', '081234567805', CURRENT_DATE + INTERVAL '1 day', '08:00', '10:00', 'regular', 150000, 'Booking regular pagi', 'confirmed', 'lunas', 'sekali_pinjam'),
(8, 2, 'Hendra Setiawan', '081234567806', CURRENT_DATE + INTERVAL '1 day', '13:00', '15:00', 'regular', 200000, 'Booking regular siang', 'pending', 'belum_bayar', 'sekali_pinjam'),
-- 2 hari lagi
(9, 1, 'Indra Jaya', '081234567807', CURRENT_DATE + INTERVAL '2 day', '18:00', '20:00', 'regular', 250000, 'Booking regular malam', 'pending', 'belum_bayar', 'sekali_pinjam');

-- Insert Booking Regular (Badminton) dengan ID eksplisit
INSERT INTO booking (id, lapangan_id, nama_pemesan, no_telepon, tanggal, jam_mulai, jam_selesai, tipe_booking, total_harga, catatan, status_booking, status_pembayaran, jenis_booking_detail) VALUES
-- Hari ini
(10, 4, 'Joko Santoso', '081234567808', CURRENT_DATE, '08:00', '11:00', 'regular', 80000, 'Booking regular pagi', 'confirmed', 'lunas', 'sekali_pinjam'),
(11, 5, 'Kartika Sari', '081234567809', CURRENT_DATE, '13:00', '16:00', 'regular', 100000, 'Booking regular siang', 'confirmed', 'lunas', 'sekali_pinjam'),
-- Kemarin
(12, 6, 'Lukman Hakim', '081234567810', CURRENT_DATE - INTERVAL '1 day', '18:00', '21:00', 'regular', 120000, 'Booking regular malam', 'confirmed', 'lunas', 'sekali_pinjam'),
(13, 4, 'Mira Lestari', '081234567811', CURRENT_DATE - INTERVAL '1 day', '08:00', '11:00', 'regular', 80000, 'Booking regular pagi', 'confirmed', 'lunas', 'sekali_pinjam'),
-- 2 hari lalu
(14, 5, 'Nanda Pratiwi', '081234567812', CURRENT_DATE - INTERVAL '2 day', '13:00', '16:00', 'regular', 100000, 'Booking regular siang', 'confirmed', 'lunas', 'sekali_pinjam'),
-- Besok
(15, 6, 'Oscar Saputra', '081234567813', CURRENT_DATE + INTERVAL '1 day', '18:00', '21:00', 'regular', 120000, 'Booking regular malam', 'confirmed', 'lunas', 'sekali_pinjam'),
-- 2 hari lagi
(16, 4, 'Putri Anggraini', '081234567814', CURRENT_DATE + INTERVAL '2 day', '08:00', '11:00', 'regular', 80000, 'Booking regular pagi', 'pending', 'belum_bayar', 'sekali_pinjam');

-- Insert Booking Event (Futsal) dengan ID eksplisit
INSERT INTO booking (id, lapangan_id, nama_pemesan, no_telepon, tanggal, jam_mulai, jam_selesai, tipe_booking, total_harga, catatan, status_booking, status_pembayaran, jenis_booking_detail) VALUES
(17, 1, 'Rudi Hartono', '081234567815', CURRENT_DATE + INTERVAL '7 day', '08:00', '17:00', 'event', 1000000, 'Turnamen Futsal Antar SMA', 'confirmed', 'lunas', 'event'),
(18, 2, 'Siti Nurbaya', '081234567816', CURRENT_DATE + INTERVAL '14 day', '08:00', '17:00', 'event', 1000000, 'Kompetisi Futsal Perusahaan', 'pending', 'belum_bayar', 'event');

-- Insert Event Details dengan ID eksplisit
INSERT INTO booking_event (id, booking_id, nama_event, deskripsi, tanggal_mulai, tanggal_selesai) VALUES
(1, 17, 'Turnamen Futsal Antar SMA', 'Turnamen futsal antar SMA se-Jakarta', CURRENT_DATE + INTERVAL '7 day', CURRENT_DATE + INTERVAL '7 day'),
(2, 18, 'Kompetisi Futsal Perusahaan', 'Kompetisi futsal antar perusahaan', CURRENT_DATE + INTERVAL '14 day', CURRENT_DATE + INTERVAL '14 day');

-- Insert Booking History dengan ID eksplisit
INSERT INTO booking_history (id, booking_id, status_lama, status_baru, catatan, admin_id, created_at) VALUES
(1, 1, 'pending', 'confirmed', 'Pembayaran telah dikonfirmasi', (SELECT id FROM admin WHERE username = 'admin'), CURRENT_TIMESTAMP - INTERVAL '2 hour'),
(2, 2, 'pending', 'confirmed', 'Pembayaran telah dikonfirmasi', (SELECT id FROM admin WHERE username = 'admin'), CURRENT_TIMESTAMP - INTERVAL '3 hour'),
(3, 4, 'pending', 'confirmed', 'Pembayaran telah dikonfirmasi', (SELECT id FROM admin WHERE username = 'admin'), CURRENT_TIMESTAMP - INTERVAL '1 day'),
(4, 5, 'pending', 'confirmed', 'Pembayaran telah dikonfirmasi', (SELECT id FROM admin WHERE username = 'admin'), CURRENT_TIMESTAMP - INTERVAL '1 day'),
(5, 6, 'pending', 'confirmed', 'Pembayaran telah dikonfirmasi', (SELECT id FROM admin WHERE username = 'admin'), CURRENT_TIMESTAMP - INTERVAL '2 day'),
(6, 7, 'pending', 'confirmed', 'Pembayaran telah dikonfirmasi', (SELECT id FROM admin WHERE username = 'admin'), CURRENT_TIMESTAMP - INTERVAL '12 hour'),
(7, 10, 'pending', 'confirmed', 'Pembayaran telah dikonfirmasi', (SELECT id FROM admin WHERE username = 'admin'), CURRENT_TIMESTAMP - INTERVAL '4 hour'),
(8, 11, 'pending', 'confirmed', 'Pembayaran telah dikonfirmasi', (SELECT id FROM admin WHERE username = 'admin'), CURRENT_TIMESTAMP - INTERVAL '5 hour'),
(9, 12, 'pending', 'confirmed', 'Pembayaran telah dikonfirmasi', (SELECT id FROM admin WHERE username = 'admin'), CURRENT_TIMESTAMP - INTERVAL '1 day'),
(10, 13, 'pending', 'confirmed', 'Pembayaran telah dikonfirmasi', (SELECT id FROM admin WHERE username = 'admin'), CURRENT_TIMESTAMP - INTERVAL '1 day'),
(11, 14, 'pending', 'confirmed', 'Pembayaran telah dikonfirmasi', (SELECT id FROM admin WHERE username = 'admin'), CURRENT_TIMESTAMP - INTERVAL '2 day'),
(12, 15, 'pending', 'confirmed', 'Pembayaran telah dikonfirmasi', (SELECT id FROM admin WHERE username = 'admin'), CURRENT_TIMESTAMP - INTERVAL '10 hour'),
(13, 17, 'pending', 'confirmed', 'Pembayaran telah dikonfirmasi', (SELECT id FROM admin WHERE username = 'admin'), CURRENT_TIMESTAMP - INTERVAL '3 day');
