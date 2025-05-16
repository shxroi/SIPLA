import pool from '../config/database.js';
import path from 'path';
import fs from 'fs';

// Pastikan folder uploads ada
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Get semua lapangan dengan waktu sewa
export const getAllLapangan = async (req, res) => {
    try {
        // Get filter parameters
        const { tipe, nomor_lapangan } = req.query;
        
        // Build the query with potential filters
        let query = `
          SELECT 
            l.*,
            COALESCE(
              json_agg(
                json_build_object(
                  'id', w.id,
                  'jam_mulai', w.jam_mulai,
                  'jam_selesai', w.jam_selesai,
                  'harga', w.harga,
                  'kategori_waktu', w.kategori_waktu
                )
              ) FILTER (WHERE w.id IS NOT NULL),
              '[]'::json
            ) as waktu_sewa
          FROM lapangan l
          LEFT JOIN waktu_sewa w ON l.id = w.lapangan_id
          WHERE 1=1
        `;
        
        const queryParams = [];
        let paramCounter = 1;
        
        // Add filters if they exist
        if (tipe) {
            query += ` AND l.tipe = $${paramCounter}`;
            queryParams.push(tipe);
            paramCounter++;
        }
        
        if (nomor_lapangan) {
            query += ` AND l.nomor_lapangan = $${paramCounter}`;
            queryParams.push(nomor_lapangan);
            paramCounter++;
        }
        
        // Add group by and order by
        query += `
          GROUP BY l.id
          ORDER BY l.id
        `;
        
        const result = await pool.query(query, queryParams);
        
        // Transform foto_url
        const lapangan = result.rows.map(lap => ({
            ...lap,
            foto_url: lap.foto_lapangan ? `http://localhost:3000/uploads/${lap.foto_lapangan}` : null
        }));
        
        res.json(lapangan);
    } catch (error) {
        console.error('Error in getAllLapangan:', error);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil data lapangan" });
    }
};

// Get detail lapangan by ID
export const getLapanganById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`
          SELECT 
            l.*,
            COALESCE(
              json_agg(
                json_build_object(
                  'id', w.id,
                  'jam_mulai', w.jam_mulai,
                  'jam_selesai', w.jam_selesai,
                  'harga', w.harga
                )
              ) FILTER (WHERE w.id IS NOT NULL),
              '[]'::json
            ) as waktu_sewa
          FROM lapangan l
          LEFT JOIN waktu_sewa w ON l.id = w.lapangan_id
          WHERE l.id = $1
          GROUP BY l.id
        `, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Lapangan tidak ditemukan" });
        }
        
        // Transform foto_url
        const lapangan = {
            ...result.rows[0],
            foto_url: result.rows[0].foto_lapangan ? 
                `http://localhost:3000/uploads/${result.rows[0].foto_lapangan}` : null
        };
        
        res.json(lapangan);
    } catch (error) {
        console.error('Error in getLapanganById:', error);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil data lapangan" });
    }
};

// Create lapangan baru
export const createLapangan = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        console.log('Request body:', req.body);
        console.log('Request file:', req.file);
        
        const { nama, tipe, status } = req.body;
        const nomor_lapangan = req.body.nomor_lapangan ? parseInt(req.body.nomor_lapangan) : 1;
        const jenis_lapangan = req.body.jenis_lapangan || tipe;
        
        // Validasi data wajib
        if (!nama || !tipe || !status) {
            return res.status(400).json({ message: "Nama, tipe, dan status lapangan wajib diisi" });
        }
        
        let waktu_sewa = [];
        
        // Parse waktu_sewa from JSON string if it exists
        if (req.body.waktu_sewa) {
            try {
                waktu_sewa = JSON.parse(req.body.waktu_sewa);
            } catch (e) {
                console.error('Error parsing waktu_sewa:', e);
                waktu_sewa = [];
            }
        }

        const foto_lapangan = req.file ? req.file.filename : null;

        // Insert lapangan
        console.log('Inserting lapangan with values:', [nama, foto_lapangan, tipe, status, nomor_lapangan, jenis_lapangan]);
        const insertLapangan = await client.query(
            'INSERT INTO lapangan (nama, foto_lapangan, tipe, status, nomor_lapangan, jenis_lapangan) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
            [nama, foto_lapangan, tipe, status, nomor_lapangan, jenis_lapangan]
        );

        const lapanganId = insertLapangan.rows[0].id;
        console.log('Lapangan created with ID:', lapanganId);

        // Insert waktu_sewa
        if (waktu_sewa && waktu_sewa.length > 0) {
            console.log('Inserting waktu_sewa:', waktu_sewa);
            for (const ws of waktu_sewa) {
                // Pastikan harga adalah angka
                const harga = parseInt(ws.harga) || 0;
                await client.query(
                    'INSERT INTO waktu_sewa (lapangan_id, jam_mulai, jam_selesai, harga, kategori_waktu) VALUES ($1, $2, $3, $4, $5)',
                    [lapanganId, ws.jam_mulai, ws.jam_selesai, harga, ws.kategori_waktu || '']
                );
            }
        }

        await client.query('COMMIT');
        res.status(201).json({ message: "Lapangan berhasil ditambahkan", id: lapanganId });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error in createLapangan:', error);
        res.status(500).json({ message: `Terjadi kesalahan saat menambah lapangan: ${error.message}` });
    } finally {
        client.release();
    }
};

// Update lapangan
export const updateLapangan = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        console.log('Update request body:', req.body);
        console.log('Update request file:', req.file);
        
        const { id } = req.params;
        const { nama, tipe, status } = req.body;
        const nomor_lapangan = req.body.nomor_lapangan ? parseInt(req.body.nomor_lapangan) : 1;
        const jenis_lapangan = req.body.jenis_lapangan || tipe;
        
        // Validasi data wajib
        if (!nama || !tipe || !status) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: "Nama, tipe, dan status lapangan wajib diisi" });
        }
        
        // Cek apakah lapangan dengan ID tersebut ada
        const checkResult = await client.query('SELECT * FROM lapangan WHERE id = $1', [id]);
        if (checkResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: "Lapangan tidak ditemukan" });
        }
        
        let waktu_sewa = [];
        
        // Parse waktu_sewa from JSON string if it exists
        if (req.body.waktu_sewa) {
            try {
                // Cek tipe data waktu_sewa
                console.log('waktu_sewa type:', typeof req.body.waktu_sewa);
                
                if (typeof req.body.waktu_sewa === 'string') {
                    waktu_sewa = JSON.parse(req.body.waktu_sewa);
                } else if (Array.isArray(req.body.waktu_sewa)) {
                    waktu_sewa = req.body.waktu_sewa;
                }
                
                console.log('Parsed waktu_sewa:', waktu_sewa);
            } catch (e) {
                console.error('Error parsing waktu_sewa:', e);
                waktu_sewa = [];
            }
        }

        const foto_lapangan = req.file ? req.file.filename : null;

        // Update lapangan
        if (foto_lapangan) {
            console.log('Updating lapangan with foto:', [nama, foto_lapangan, tipe, status, nomor_lapangan, jenis_lapangan, id]);
            await client.query(
                'UPDATE lapangan SET nama = $1, foto_lapangan = $2, tipe = $3, status = $4, nomor_lapangan = $5, jenis_lapangan = $6 WHERE id = $7',
                [nama, foto_lapangan, tipe, status, nomor_lapangan, jenis_lapangan, id]
            );
        } else {
            console.log('Updating lapangan without foto:', [nama, tipe, status, nomor_lapangan, jenis_lapangan, id]);
            await client.query(
                'UPDATE lapangan SET nama = $1, tipe = $2, status = $3, nomor_lapangan = $4, jenis_lapangan = $5 WHERE id = $6',
                [nama, tipe, status, nomor_lapangan, jenis_lapangan, id]
            );
        }
        
        // Update waktu_sewa
        // First delete existing waktu_sewa
        await client.query('DELETE FROM waktu_sewa WHERE lapangan_id = $1', [id]);
        
        // Then insert new waktu_sewa
        if (waktu_sewa && waktu_sewa.length > 0) {
            console.log('Updating waktu_sewa:', waktu_sewa);
            for (const ws of waktu_sewa) {
                // Pastikan harga adalah angka
                const harga = parseInt(ws.harga) || 0;
                await client.query(
                    'INSERT INTO waktu_sewa (lapangan_id, jam_mulai, jam_selesai, harga, kategori_waktu) VALUES ($1, $2, $3, $4, $5)',
                    [id, ws.jam_mulai, ws.jam_selesai, harga, ws.kategori_waktu || '']
                );
            }
        }

        await client.query('COMMIT');
        res.json({ message: "Lapangan berhasil diupdate" });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error in updateLapangan:', error);
        res.status(500).json({ message: `Terjadi kesalahan saat mengupdate lapangan: ${error.message}` });
    } finally {
        client.release();
    }
};

// Delete lapangan
export const deleteLapangan = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        const { id } = req.params;
        
        // Delete waktu_sewa first due to foreign key constraint
        await client.query('DELETE FROM waktu_sewa WHERE lapangan_id = $1', [id]);
        
        // Then delete the lapangan
        await client.query('DELETE FROM lapangan WHERE id = $1', [id]);
        
        await client.query('COMMIT');
        res.json({ message: "Lapangan berhasil dihapus" });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error in deleteLapangan:', error);
        res.status(500).json({ message: "Terjadi kesalahan saat menghapus lapangan" });
    } finally {
        client.release();
    }
};

export default {
    getAllLapangan,
    getLapanganById,
    createLapangan,
    updateLapangan,
    deleteLapangan
};