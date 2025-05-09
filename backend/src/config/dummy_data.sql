-- Data Dummy untuk Dashboard TQ1 Sports Field Booking System

-- Reset data (hapus data yang ada)
DELETE FROM booking_history;
DELETE FROM booking_event;
DELETE FROM booking;
DELETE FROM waktu_sewa;
DELETE FROM lapangan;
DELETE FROM member;
DELETE FROM admin WHERE username != 'admin'; -- Jangan hapus admin utama

-- Insert Admin (jika belum ada)
INSERT INTO admin (username, password, no_hp, email)
SELECT 'admin', 'admin123', '081234567890', 'admin@tq1sports.com'
WHERE NOT EXISTS (SELECT 1 FROM admin WHERE username = 'admin');

-- Insert Lapangan Futsal
INSERT INTO lapangan (nama, tipe, status, nomor_lapangan, foto_lapangan) VALUES
('Lapangan Futsal A', 'futsal', 'tersedia', 1, NULL),
('Lapangan Futsal B', 'futsal', 'tersedia', 2, NULL),
('Lapangan Futsal C', 'futsal', 'maintenance', 3, NULL);

-- Insert Lapangan Badminton
INSERT INTO lapangan (nama, tipe, status, nomor_lapangan, foto_lapangan) VALUES
('Lapangan Badminton 1', 'bulutangkis', 'tersedia', 1, NULL),
('Lapangan Badminton 2', 'bulutangkis', 'tersedia', 2, NULL),
('Lapangan Badminton 3', 'bulutangkis', 'tersedia', 3, NULL),
('Lapangan Badminton 4', 'bulutangkis', 'maintenance', 4, NULL);

-- Insert Waktu Sewa untuk Lapangan Futsal
INSERT INTO waktu_sewa (lapangan_id, jam_mulai, jam_selesai, harga, kategori_waktu) VALUES
-- Lapangan Futsal A
(1, '08:00', '10:00', 150000, 'pagi'),
(1, '10:00', '12:00', 150000, 'pagi'),
(1, '13:00', '15:00', 200000, 'siang'),
(1, '15:00', '17:00', 200000, 'siang'),
(1, '18:00', '20:00', 250000, 'malam'),
(1, '20:00', '22:00', 250000, 'malam'),
-- Lapangan Futsal B
(2, '08:00', '10:00', 150000, 'pagi'),
(2, '10:00', '12:00', 150000, 'pagi'),
(2, '13:00', '15:00', 200000, 'siang'),
(2, '15:00', '17:00', 200000, 'siang'),
(2, '18:00', '20:00', 250000, 'malam'),
(2, '20:00', '22:00', 250000, 'malam'),
-- Lapangan Futsal C
(3, '08:00', '10:00', 150000, 'pagi'),
(3, '10:00', '12:00', 150000, 'pagi'),
(3, '13:00', '15:00', 200000, 'siang'),
(3, '15:00', '17:00', 200000, 'siang'),
(3, '18:00', '20:00', 250000, 'malam'),
(3, '20:00', '22:00', 250000, 'malam');

-- Insert Waktu Sewa untuk Lapangan Badminton
INSERT INTO waktu_sewa (lapangan_id, jam_mulai, jam_selesai, harga, kategori_waktu) VALUES
-- Lapangan Badminton 1
(4, '08:00', '11:00', 80000, 'pagi'),
(4, '13:00', '16:00', 100000, 'siang'),
(4, '18:00', '21:00', 120000, 'malam'),
-- Lapangan Badminton 2
(5, '08:00', '11:00', 80000, 'pagi'),
(5, '13:00', '16:00', 100000, 'siang'),
(5, '18:00', '21:00', 120000, 'malam'),
-- Lapangan Badminton 3
(6, '08:00', '11:00', 80000, 'pagi'),
(6, '13:00', '16:00', 100000, 'siang'),
(6, '18:00', '21:00', 120000, 'malam'),
-- Lapangan Badminton 4
(7, '08:00', '11:00', 80000, 'pagi'),
(7, '13:00', '16:00', 100000, 'siang'),
(7, '18:00', '21:00', 120000, 'malam');

-- Insert Member Badminton
INSERT INTO member (nama, no_telepon, email, tanggal_mulai, tanggal_selesai, biaya_pendaftaran, tipe, status) VALUES
('Budi Santoso', '081234567891', 'budi@example.com', '2025-04-01', '2025-07-01', 300000, 'bulutangkis', 'aktif'),
('Dewi Lestari', '081234567892', 'dewi@example.com', '2025-04-10', '2025-07-10', 300000, 'bulutangkis', 'aktif'),
('Eko Prasetyo', '081234567893', 'eko@example.com', '2025-03-15', '2025-06-15', 300000, 'bulutangkis', 'aktif'),
('Fitri Handayani', '081234567894', 'fitri@example.com', '2025-02-20', '2025-05-20', 300000, 'bulutangkis', 'aktif'),
('Gunawan Wibowo', '081234567895', 'gunawan@example.com', '2025-01-05', '2025-04-05', 300000, 'bulutangkis', 'expired'),
('Hani Susanti', '081234567896', 'hani@example.com', '2025-01-10', '2025-04-10', 300000, 'bulutangkis', 'expired'),
('Irfan Hakim', '081234567897', 'irfan@example.com', '2025-04-20', '2025-07-20', 300000, 'bulutangkis', 'aktif'),
('Joko Widodo', '081234567898', 'joko@example.com', '2025-04-25', '2025-07-25', 300000, 'bulutangkis', 'aktif');

-- Insert Booking Regular (Futsal)
INSERT INTO booking (lapangan_id, nama_pemesan, no_telepon, tanggal, jam_mulai, jam_selesai, tipe_booking, total_harga, catatan, status_booking, status_pembayaran) VALUES
-- Hari ini
(1, 'Ahmad Rizal', '081234567899', CURRENT_DATE, '08:00', '10:00', 'regular', 150000, 'Booking regular pagi', 'confirmed', 'lunas'),
(2, 'Bayu Pratama', '081234567800', CURRENT_DATE, '13:00', '15:00', 'regular', 200000, 'Booking regular siang', 'confirmed', 'lunas'),
(1, 'Candra Wijaya', '081234567801', CURRENT_DATE, '18:00', '20:00', 'regular', 250000, 'Booking regular malam', 'pending', 'belum_bayar'),
-- Kemarin
(2, 'Dodi Sudrajat', '081234567802', CURRENT_DATE - INTERVAL '1 day', '08:00', '10:00', 'regular', 150000, 'Booking regular pagi', 'confirmed', 'lunas'),
(1, 'Edi Sumarno', '081234567803', CURRENT_DATE - INTERVAL '1 day', '13:00', '15:00', 'regular', 200000, 'Booking regular siang', 'confirmed', 'lunas'),
-- 2 hari lalu
(2, 'Faisal Akbar', '081234567804', CURRENT_DATE - INTERVAL '2 day', '18:00', '20:00', 'regular', 250000, 'Booking regular malam', 'confirmed', 'lunas'),
-- Besok
(1, 'Galih Pratama', '081234567805', CURRENT_DATE + INTERVAL '1 day', '08:00', '10:00', 'regular', 150000, 'Booking regular pagi', 'confirmed', 'lunas'),
(2, 'Hendra Setiawan', '081234567806', CURRENT_DATE + INTERVAL '1 day', '13:00', '15:00', 'regular', 200000, 'Booking regular siang', 'pending', 'belum_bayar'),
-- 2 hari lagi
(1, 'Indra Jaya', '081234567807', CURRENT_DATE + INTERVAL '2 day', '18:00', '20:00', 'regular', 250000, 'Booking regular malam', 'pending', 'belum_bayar');

-- Insert Booking Regular (Badminton)
INSERT INTO booking (lapangan_id, nama_pemesan, no_telepon, tanggal, jam_mulai, jam_selesai, tipe_booking, total_harga, catatan, status_booking, status_pembayaran) VALUES
-- Hari ini
(4, 'Joko Santoso', '081234567808', CURRENT_DATE, '08:00', '11:00', 'regular', 80000, 'Booking regular pagi', 'confirmed', 'lunas'),
(5, 'Kartika Sari', '081234567809', CURRENT_DATE, '13:00', '16:00', 'regular', 100000, 'Booking regular siang', 'confirmed', 'lunas'),
-- Kemarin
(6, 'Lukman Hakim', '081234567810', CURRENT_DATE - INTERVAL '1 day', '18:00', '21:00', 'regular', 120000, 'Booking regular malam', 'confirmed', 'lunas'),
(4, 'Mira Lestari', '081234567811', CURRENT_DATE - INTERVAL '1 day', '08:00', '11:00', 'regular', 80000, 'Booking regular pagi', 'confirmed', 'lunas'),
-- 2 hari lalu
(5, 'Nanda Pratiwi', '081234567812', CURRENT_DATE - INTERVAL '2 day', '13:00', '16:00', 'regular', 100000, 'Booking regular siang', 'confirmed', 'lunas'),
-- Besok
(6, 'Oscar Saputra', '081234567813', CURRENT_DATE + INTERVAL '1 day', '18:00', '21:00', 'regular', 120000, 'Booking regular malam', 'confirmed', 'lunas'),
-- 2 hari lagi
(4, 'Putri Anggraini', '081234567814', CURRENT_DATE + INTERVAL '2 day', '08:00', '11:00', 'regular', 80000, 'Booking regular pagi', 'pending', 'belum_bayar');

-- Insert Booking Event (Futsal)
INSERT INTO booking (lapangan_id, nama_pemesan, no_telepon, tanggal, jam_mulai, jam_selesai, tipe_booking, total_harga, catatan, status_booking, status_pembayaran) VALUES
(1, 'Rudi Hartono', '081234567815', CURRENT_DATE + INTERVAL '7 day', '08:00', '17:00', 'event', 1000000, 'Turnamen Futsal Antar SMA', 'confirmed', 'lunas'),
(2, 'Siti Nurbaya', '081234567816', CURRENT_DATE + INTERVAL '14 day', '08:00', '17:00', 'event', 1000000, 'Kompetisi Futsal Perusahaan', 'pending', 'belum_bayar');

-- Insert Event Details
INSERT INTO booking_event (booking_id, nama_event, deskripsi, tanggal_mulai, tanggal_selesai) VALUES
((SELECT id FROM booking WHERE nama_pemesan = 'Rudi Hartono'), 'Turnamen Futsal Antar SMA', 'Turnamen futsal antar SMA se-Jakarta', CURRENT_DATE + INTERVAL '7 day', CURRENT_DATE + INTERVAL '7 day'),
((SELECT id FROM booking WHERE nama_pemesan = 'Siti Nurbaya'), 'Kompetisi Futsal Perusahaan', 'Kompetisi futsal antar perusahaan', CURRENT_DATE + INTERVAL '14 day', CURRENT_DATE + INTERVAL '14 day');

-- Insert Booking History
INSERT INTO booking_history (booking_id, status_lama, status_baru, catatan, admin_id, created_at) VALUES
((SELECT id FROM booking WHERE nama_pemesan = 'Ahmad Rizal'), 'pending', 'confirmed', 'Pembayaran telah dikonfirmasi', (SELECT id FROM admin WHERE username = 'admin'), CURRENT_TIMESTAMP - INTERVAL '2 hour'),
((SELECT id FROM booking WHERE nama_pemesan = 'Bayu Pratama'), 'pending', 'confirmed', 'Pembayaran telah dikonfirmasi', (SELECT id FROM admin WHERE username = 'admin'), CURRENT_TIMESTAMP - INTERVAL '3 hour'),
((SELECT id FROM booking WHERE nama_pemesan = 'Dodi Sudrajat'), 'pending', 'confirmed', 'Pembayaran telah dikonfirmasi', (SELECT id FROM admin WHERE username = 'admin'), CURRENT_TIMESTAMP - INTERVAL '1 day'),
((SELECT id FROM booking WHERE nama_pemesan = 'Edi Sumarno'), 'pending', 'confirmed', 'Pembayaran telah dikonfirmasi', (SELECT id FROM admin WHERE username = 'admin'), CURRENT_TIMESTAMP - INTERVAL '1 day'),
((SELECT id FROM booking WHERE nama_pemesan = 'Faisal Akbar'), 'pending', 'confirmed', 'Pembayaran telah dikonfirmasi', (SELECT id FROM admin WHERE username = 'admin'), CURRENT_TIMESTAMP - INTERVAL '2 day'),
((SELECT id FROM booking WHERE nama_pemesan = 'Galih Pratama'), 'pending', 'confirmed', 'Pembayaran telah dikonfirmasi', (SELECT id FROM admin WHERE username = 'admin'), CURRENT_TIMESTAMP - INTERVAL '12 hour'),
((SELECT id FROM booking WHERE nama_pemesan = 'Joko Santoso'), 'pending', 'confirmed', 'Pembayaran telah dikonfirmasi', (SELECT id FROM admin WHERE username = 'admin'), CURRENT_TIMESTAMP - INTERVAL '4 hour'),
((SELECT id FROM booking WHERE nama_pemesan = 'Kartika Sari'), 'pending', 'confirmed', 'Pembayaran telah dikonfirmasi', (SELECT id FROM admin WHERE username = 'admin'), CURRENT_TIMESTAMP - INTERVAL '5 hour'),
((SELECT id FROM booking WHERE nama_pemesan = 'Lukman Hakim'), 'pending', 'confirmed', 'Pembayaran telah dikonfirmasi', (SELECT id FROM admin WHERE username = 'admin'), CURRENT_TIMESTAMP - INTERVAL '1 day'),
((SELECT id FROM booking WHERE nama_pemesan = 'Mira Lestari'), 'pending', 'confirmed', 'Pembayaran telah dikonfirmasi', (SELECT id FROM admin WHERE username = 'admin'), CURRENT_TIMESTAMP - INTERVAL '1 day'),
((SELECT id FROM booking WHERE nama_pemesan = 'Nanda Pratiwi'), 'pending', 'confirmed', 'Pembayaran telah dikonfirmasi', (SELECT id FROM admin WHERE username = 'admin'), CURRENT_TIMESTAMP - INTERVAL '2 day'),
((SELECT id FROM booking WHERE nama_pemesan = 'Oscar Saputra'), 'pending', 'confirmed', 'Pembayaran telah dikonfirmasi', (SELECT id FROM admin WHERE username = 'admin'), CURRENT_TIMESTAMP - INTERVAL '10 hour'),
((SELECT id FROM booking WHERE nama_pemesan = 'Rudi Hartono'), 'pending', 'confirmed', 'Pembayaran telah dikonfirmasi', (SELECT id FROM admin WHERE username = 'admin'), CURRENT_TIMESTAMP - INTERVAL '3 day');

-- Insert Member History
INSERT INTO member_history (member_id, jenis_transaksi, tanggal_transaksi, biaya, keterangan) VALUES
((SELECT id FROM member WHERE nama = 'Budi Santoso'), 'pendaftaran', '2025-04-01', 300000, 'Pendaftaran member baru'),
((SELECT id FROM member WHERE nama = 'Dewi Lestari'), 'pendaftaran', '2025-04-10', 300000, 'Pendaftaran member baru'),
((SELECT id FROM member WHERE nama = 'Eko Prasetyo'), 'pendaftaran', '2025-03-15', 300000, 'Pendaftaran member baru'),
((SELECT id FROM member WHERE nama = 'Fitri Handayani'), 'pendaftaran', '2025-02-20', 300000, 'Pendaftaran member baru'),
((SELECT id FROM member WHERE nama = 'Gunawan Wibowo'), 'pendaftaran', '2025-01-05', 300000, 'Pendaftaran member baru'),
((SELECT id FROM member WHERE nama = 'Hani Susanti'), 'pendaftaran', '2025-01-10', 300000, 'Pendaftaran member baru'),
((SELECT id FROM member WHERE nama = 'Irfan Hakim'), 'pendaftaran', '2025-04-20', 300000, 'Pendaftaran member baru'),
((SELECT id FROM member WHERE nama = 'Joko Widodo'), 'pendaftaran', '2025-04-25', 300000, 'Pendaftaran member baru');
