-- Create admin table
CREATE TABLE IF NOT EXISTS admin (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL
);

-- Create lapangan table
CREATE TABLE IF NOT EXISTS lapangan (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    foto_lapangan VARCHAR(255),
    tipe VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'tersedia'
);

-- Create waktu_sewa table
CREATE TABLE IF NOT EXISTS waktu_sewa (
    id SERIAL PRIMARY KEY,
    lapangan_id INTEGER REFERENCES lapangan(id) ON DELETE CASCADE,
    jam_mulai TIME NOT NULL,
    jam_selesai TIME NOT NULL,
    harga INTEGER NOT NULL
);

-- Insert default admin
INSERT INTO admin (username, password) VALUES ('admin', 'admin123')
ON CONFLICT (username) DO NOTHING;
