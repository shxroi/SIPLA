-- testimonial.sql

-- Buat tabel testimonial
CREATE TABLE IF NOT EXISTS testimonial (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    pesan TEXT NOT NULL,
    lapangan_id INTEGER NOT NULL,
    rating INTEGER DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lapangan_id) REFERENCES lapangan(id) ON DELETE CASCADE
);

-- Indeks untuk pencarian dan pengurutan
CREATE INDEX IF NOT EXISTS idx_testimonial_status ON testimonial(status);
CREATE INDEX IF NOT EXISTS idx_testimonial_created_at ON testimonial(created_at);
