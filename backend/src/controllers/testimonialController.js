// testimonialController.js

import pool from '../config/database.js';

// Get testimonial berdasarkan lapangan_id (untuk publik)
export const getTestimonialsByField = async (req, res) => {
    try {
        const { lapanganId } = req.params;
        
        // Validasi lapanganId
        if (!lapanganId || isNaN(parseInt(lapanganId))) {
            return res.status(400).json({ message: "ID lapangan tidak valid" });
        }
        
        const {
            page = 1,
            limit = 10,
            status = 'approved' // default hanya menampilkan yang sudah diapprove
        } = req.query;
        
        const offset = (page - 1) * limit;
        let params = [parseInt(lapanganId)]; // Pastikan lapanganId adalah integer
        let whereClause = ['t.lapangan_id = $1']; // Tambahkan alias tabel
        let paramCounter = 2;
        
        // Filter berdasarkan status
        if (status !== 'all') {
            whereClause.push(`t.status = $${paramCounter++}`);
            params.push(status);
        }
        
        const whereString = 'WHERE ' + whereClause.join(' AND ');
        
        // Get total count
        const countQuery = `
            SELECT COUNT(*) 
            FROM testimonial t
            ${whereString}
        `;
        
        const countResult = await pool.query(countQuery, params);
        const totalItems = parseInt(countResult.rows[0].count);
        const totalPages = Math.ceil(totalItems / limit);
        
        // Get testimonials
        const query = `
            SELECT t.id, t.nama, t.email, t.pesan, t.rating, t.status, t.created_at, l.nama as lapangan_nama
            FROM testimonial t
            LEFT JOIN lapangan l ON t.lapangan_id = l.id
            ${whereString}
            ORDER BY t.created_at DESC
            LIMIT $${paramCounter++} OFFSET $${paramCounter++}
        `;
        
        params.push(parseInt(limit), offset);
        
        const result = await pool.query(query, params);
        
        res.json({
            data: result.rows,
            pagination: {
                totalItems,
                totalPages,
                currentPage: parseInt(page),
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Error in getTestimonialsByField:', error);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil data testimonial" });
    }
};



// Get semua testimonial (untuk publik)
export const getAllTestimonials = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            status = 'approved' // default hanya menampilkan yang sudah diapprove
        } = req.query;
        
        const offset = (page - 1) * limit;
        let params = [];
        let whereClause = [];
        let paramCounter = 1;
        
        // Filter berdasarkan status
        if (status !== 'all') {
            whereClause.push(`status = $${paramCounter++}`);
            params.push(status);
        }
        
        const whereString = whereClause.length > 0 
            ? 'WHERE ' + whereClause.join(' AND ') 
            : '';
        
        // Get total count
        const countQuery = `
            SELECT COUNT(*) 
            FROM testimonial
            ${whereString}
        `;
        
        const countResult = await pool.query(countQuery, params);
        const totalItems = parseInt(countResult.rows[0].count);
        const totalPages = Math.ceil(totalItems / limit);
        
        // Get testimonials
        const query = `
            SELECT t.id, t.nama, t.email, t.pesan, t.rating, t.status, t.created_at, l.nama as lapangan_nama
            FROM testimonial t
            JOIN lapangan l ON t.lapangan_id = l.id
            ${whereString}
            ORDER BY t.created_at DESC
            LIMIT $${paramCounter++} OFFSET $${paramCounter++}
        `;
        
        params.push(parseInt(limit), offset);
        
        const result = await pool.query(query, params);
        
        res.json({
            data: result.rows,
            pagination: {
                totalItems,
                totalPages,
                currentPage: parseInt(page),
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Error in getAllTestimonials:', error);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil data testimonial" });
    }
};

// Get rating rata-rata per lapangan
export const getAverageRatingByField = async (req, res) => {
    try {
        const { lapanganId } = req.params;
        
        // Validasi lapanganId
        if (!lapanganId || isNaN(parseInt(lapanganId))) {
            return res.status(400).json({ message: "ID lapangan tidak valid" });
        }
        
        const query = `
            SELECT COALESCE(AVG(rating), 0) as average_rating, COUNT(*) as total_reviews
            FROM testimonial
            WHERE lapangan_id = $1 AND status = 'approved'
        `;
        
        const result = await pool.query(query, [parseInt(lapanganId)]);
        
        res.json({
            lapangan_id: parseInt(lapanganId),
            average_rating: parseFloat(result.rows[0].average_rating || 0),
            total_reviews: parseInt(result.rows[0].total_reviews || 0)
        });
    } catch (error) {
        console.error('Error in getAverageRatingByField:', error);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil rating lapangan" });
    }
};

// Create testimonial baru (untuk publik)
export const createTestimonial = async (req, res) => {
    try {
        const { 
            nama, 
            email, 
            pesan, 
            lapangan_id,
            rating = 5 // default rating 5 bintang
        } = req.body;
        
        // Validasi data wajib
        if (!nama || !pesan) {
            return res.status(400).json({ message: "Nama dan pesan harus diisi" });
        }
        
        // Validasi lapangan_id
        if (!lapangan_id || isNaN(parseInt(lapangan_id))) {
            return res.status(400).json({ message: "ID lapangan tidak valid" });
        }
        
        // Validasi rating
        const ratingValue = parseInt(rating);
        if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
            return res.status(400).json({ message: "Rating harus berupa angka 1-5" });
        }
        
        // Periksa apakah lapangan ada
        const checkLapanganQuery = `SELECT id FROM lapangan WHERE id = $1`;
        const lapanganResult = await pool.query(checkLapanganQuery, [parseInt(lapangan_id)]);
        
        if (lapanganResult.rows.length === 0) {
            return res.status(404).json({ message: "Lapangan tidak ditemukan" });
        }
        
        // Insert testimonial
        const query = `
            INSERT INTO testimonial (
                nama, email, pesan, lapangan_id, rating, status
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, nama, email, pesan, lapangan_id, rating, status, created_at
        `;
        
        const result = await pool.query(query, [
            nama, 
            email || null, 
            pesan, 
            parseInt(lapangan_id),
            ratingValue,
            'pending' // default status pending (menunggu approval)
        ]);
        
        res.status(201).json({
            message: "Terima kasih! Kesan dan pesan Anda telah dikirim dan sedang menunggu persetujuan.",
            testimonial: result.rows[0]
        });
    } catch (error) {
        console.error('Error in createTestimonial:', error);
        
        // Tangani error foreign key constraint
        if (error.code === '23503') { // foreign key violation
            return res.status(400).json({ message: "Lapangan yang dipilih tidak valid" });
        }
        
        res.status(500).json({ message: "Terjadi kesalahan saat mengirim testimonial" });
    }
};

// Get semua testimonial (untuk admin)
export const getAllTestimonialsAdmin = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            status = 'all',
            search
        } = req.query;
        
        const offset = (page - 1) * limit;
        let params = [];
        let whereClause = [];
        let paramCounter = 1;
        
        // Filter berdasarkan status
        if (status !== 'all') {
            whereClause.push(`status = $${paramCounter++}`);
            params.push(status);
        }
        
        // Filter berdasarkan search
        if (search) {
            whereClause.push(`(
                nama ILIKE $${paramCounter} OR 
                email ILIKE $${paramCounter} OR
                pesan ILIKE $${paramCounter}
            )`);
            params.push(`%${search}%`);
            paramCounter++;
        }
        
        const whereString = whereClause.length > 0 
            ? 'WHERE ' + whereClause.join(' AND ') 
            : '';
        
        // Get total count
        const countQuery = `
            SELECT COUNT(*) 
            FROM testimonial
            ${whereString}
        `;
        
        const countResult = await pool.query(countQuery, params);
        const totalItems = parseInt(countResult.rows[0].count);
        const totalPages = Math.ceil(totalItems / limit);
        
        // Get testimonials
        const query = `
            SELECT id, nama, email, pesan, rating, status, created_at
            FROM testimonial
            ${whereString}
            ORDER BY created_at DESC
            LIMIT $${paramCounter++} OFFSET $${paramCounter++}
        `;
        
        params.push(parseInt(limit), offset);
        
        const result = await pool.query(query, params);
        
        res.json({
            data: result.rows,
            pagination: {
                totalItems,
                totalPages,
                currentPage: parseInt(page),
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Error in getAllTestimonialsAdmin:', error);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil data testimonial" });
    }
};

// Update status testimonial (untuk admin)
export const updateTestimonialStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        // Validasi status
        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: "Status tidak valid" });
        }
        
        // Update status
        const query = `
            UPDATE testimonial
            SET status = $1, updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING id, nama, email, pesan, rating, status, created_at, updated_at
        `;
        
        const result = await pool.query(query, [status, id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Testimonial tidak ditemukan" });
        }
        
        res.json({
            message: `Status testimonial berhasil diubah menjadi ${status}`,
            testimonial: result.rows[0]
        });
    } catch (error) {
        console.error('Error in updateTestimonialStatus:', error);
        res.status(500).json({ message: "Terjadi kesalahan saat mengupdate status testimonial" });
    }
};

// Delete testimonial (untuk admin)
export const deleteTestimonial = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Delete testimonial
        const query = `
            DELETE FROM testimonial
            WHERE id = $1
            RETURNING id
        `;
        
        const result = await pool.query(query, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Testimonial tidak ditemukan" });
        }
        
        res.json({
            message: "Testimonial berhasil dihapus",
            id: result.rows[0].id
        });
    } catch (error) {
        console.error('Error in deleteTestimonial:', error);
        res.status(500).json({ message: "Terjadi kesalahan saat menghapus testimonial" });
    }
};

export default {
    getAllTestimonials,
    createTestimonial,
    getAllTestimonialsAdmin,
    updateTestimonialStatus,
    deleteTestimonial
};
