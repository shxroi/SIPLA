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
        
        const { nama, tipe, status } = req.body;
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
        const insertLapangan = await client.query(
            'INSERT INTO lapangan (nama, foto_lapangan, tipe, status) VALUES ($1, $2, $3, $4) RETURNING id',
            [nama, foto_lapangan, tipe, status]
        );

        const lapanganId = insertLapangan.rows[0].id;

        // Insert waktu_sewa
        if (waktu_sewa && waktu_sewa.length > 0) {
            const waktuSewaValues = waktu_sewa.map(ws => 
                `(${lapanganId}, '${ws.jam_mulai}', '${ws.jam_selesai}', ${ws.harga}, '${ws.kategori_waktu || ''}')`
            ).join(',');

            await client.query(`
                INSERT INTO waktu_sewa (lapangan_id, jam_mulai, jam_selesai, harga, kategori_waktu)
                VALUES ${waktuSewaValues}
            `);
        }

        await client.query('COMMIT');
        res.status(201).json({ message: "Lapangan berhasil ditambahkan", id: lapanganId });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error in createLapangan:', error);
        res.status(500).json({ message: "Terjadi kesalahan saat menambah lapangan" });
    } finally {
        client.release();
    }
};

// Update lapangan
export const updateLapangan = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        const { id } = req.params;
        const { nama, tipe, status } = req.body;
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

        // Update lapangan
        if (foto_lapangan) {
            await client.query(
                'UPDATE lapangan SET nama = $1, foto_lapangan = $2, tipe = $3, status = $4 WHERE id = $5',
                [nama, foto_lapangan, tipe, status, id]
            );
        } else {
            await client.query(
                'UPDATE lapangan SET nama = $1, tipe = $2, status = $3 WHERE id = $4',
                [nama, tipe, status, id]
            );
        }

        // Delete existing waktu_sewa
        await client.query('DELETE FROM waktu_sewa WHERE lapangan_id = $1', [id]);

        // Insert new waktu_sewa
        if (waktu_sewa && waktu_sewa.length > 0) {
            const waktuSewaValues = waktu_sewa.map(ws => 
                `(${id}, '${ws.jam_mulai}', '${ws.jam_selesai}', ${ws.harga}, '${ws.kategori_waktu || ''}')`
            ).join(',');

            await client.query(`
                INSERT INTO waktu_sewa (lapangan_id, jam_mulai, jam_selesai, harga, kategori_waktu)
                VALUES ${waktuSewaValues}
            `);
        }

        await client.query('COMMIT');
        res.json({ message: "Lapangan berhasil diupdate" });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error in updateLapangan:', error);
        res.status(500).json({ message: "Terjadi kesalahan saat mengupdate lapangan" });
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