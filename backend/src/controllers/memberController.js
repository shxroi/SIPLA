// memberController.js

import pool from '../config/database.js';

// Get semua member bulutangkis
export const getAllMembers = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            status
        } = req.query;
        
        const offset = (page - 1) * limit;
        let params = [];
        let whereClause = [];
        let paramCounter = 1;
        
        // Filter berdasarkan status
        if (status) {
            whereClause.push(`status = $${paramCounter++}`);
            params.push(status);
        } else {
            // Default menampilkan member aktif
            whereClause.push(`status = 'aktif'`);
        }
        
        // Filter berdasarkan search
        if (search) {
            whereClause.push(`(
                nama ILIKE $${paramCounter} OR 
                no_telepon ILIKE $${paramCounter}
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
            FROM member
            ${whereString}
        `;
        
        const countResult = await pool.query(countQuery, params);
        const totalItems = parseInt(countResult.rows[0].count);
        const totalPages = Math.ceil(totalItems / limit);
        
        // Get members
        const query = `
            SELECT m.*, l.nama as lapangan_nama, l.tipe as lapangan_tipe
            FROM member m
            LEFT JOIN lapangan l ON m.lapangan_id = l.id
            ${whereString}
            ORDER BY m.created_at DESC
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
        console.error('Error in getAllMembers:', error);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil data member" });
    }
};

// Get detail member by ID
export const getMemberById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const query = `
            SELECT * 
            FROM member
            WHERE id = $1
        `;
        
        const result = await pool.query(query, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Member tidak ditemukan" });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error in getMemberById:', error);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil detail member" });
    }
};

// Create member baru
export const createMember = async (req, res) => {
    try {
        const { 
            nama, 
            no_telepon, 
            email, 
            tanggal_mulai, 
            tanggal_selesai,
            biaya_pendaftaran
        } = req.body;
        
        // Insert member
        const query = `
            INSERT INTO member (
                nama, no_telepon, email, tanggal_mulai, tanggal_selesai, 
                biaya_pendaftaran, tipe, status
            ) VALUES ($1, $2, $3, $4, $5, $6, 'bulutangkis', 'aktif')
            RETURNING id
        `;
        
        const result = await pool.query(query, [
            nama, no_telepon, email, tanggal_mulai, tanggal_selesai, biaya_pendaftaran
        ]);
        
        res.status(201).json({ 
            message: "Member berhasil ditambahkan", 
            id: result.rows[0].id 
        });
    } catch (error) {
        console.error('Error in createMember:', error);
        res.status(500).json({ message: "Terjadi kesalahan saat menambahkan member" });
    }
};

// Update member
export const updateMember = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            nama, 
            no_telepon, 
            email, 
            tanggal_mulai, 
            tanggal_selesai,
            biaya_pendaftaran,
            status
        } = req.body;
        
        // Update member
        const query = `
            UPDATE member
            SET 
                nama = COALESCE($1, nama),
                no_telepon = COALESCE($2, no_telepon),
                email = COALESCE($3, email),
                tanggal_mulai = COALESCE($4, tanggal_mulai),
                tanggal_selesai = COALESCE($5, tanggal_selesai),
                biaya_pendaftaran = COALESCE($6, biaya_pendaftaran),
                status = COALESCE($7, status),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $8
            RETURNING *
        `;
        
        const result = await pool.query(query, [
            nama, no_telepon, email, tanggal_mulai, tanggal_selesai, 
            biaya_pendaftaran, status, id
        ]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Member tidak ditemukan" });
        }
        
        res.json({ 
            message: "Member berhasil diupdate", 
            member: result.rows[0] 
        });
    } catch (error) {
        console.error('Error in updateMember:', error);
        res.status(500).json({ message: "Terjadi kesalahan saat mengupdate member" });
    }
};

// Delete member
export const deleteMember = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Delete member
        const query = `
            DELETE FROM member
            WHERE id = $1
            RETURNING id
        `;
        
        const result = await pool.query(query, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Member tidak ditemukan" });
        }
        
        res.json({ message: "Member berhasil dihapus" });
    } catch (error) {
        console.error('Error in deleteMember:', error);
        res.status(500).json({ message: "Terjadi kesalahan saat menghapus member" });
    }
};

// Perpanjang membership
export const extendMembership = async (req, res) => {
    try {
        const { id } = req.params;
        const { tanggal_selesai, biaya_perpanjangan } = req.body;
        
        // Get current member data
        const getMemberQuery = `
            SELECT * FROM member WHERE id = $1
        `;
        
        const memberResult = await pool.query(getMemberQuery, [id]);
        
        if (memberResult.rows.length === 0) {
            return res.status(404).json({ message: "Member tidak ditemukan" });
        }
        
        const member = memberResult.rows[0];
        
        // Validate new end date is after current end date
        const currentEndDate = new Date(member.tanggal_selesai);
        const newEndDate = new Date(tanggal_selesai);
        
        if (newEndDate <= currentEndDate) {
            return res.status(400).json({ 
                message: "Tanggal selesai baru harus setelah tanggal selesai saat ini" 
            });
        }
        
        // Update member with new end date
        const updateQuery = `
            UPDATE member
            SET 
                tanggal_selesai = $1,
                status = 'aktif',
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING *
        `;
        
        const updateResult = await pool.query(updateQuery, [tanggal_selesai, id]);
        
        // Record perpanjangan in history
        const historyQuery = `
            INSERT INTO member_history (
                member_id, jenis_transaksi, tanggal_transaksi, 
                biaya, keterangan
            ) VALUES (
                $1, 'perpanjangan', CURRENT_DATE, $2, 
                $3
            )
        `;
        
        const keterangan = `Perpanjangan membership dari ${member.tanggal_selesai} hingga ${tanggal_selesai}`;
        
        await pool.query(historyQuery, [
            id, biaya_perpanjangan, keterangan
        ]);
        
        res.json({ 
            message: "Membership berhasil diperpanjang", 
            member: updateResult.rows[0] 
        });
    } catch (error) {
        console.error('Error in extendMembership:', error);
        res.status(500).json({ message: "Terjadi kesalahan saat memperpanjang membership" });
    }
};

// Get history member
export const getMemberHistory = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if member exists
        const memberQuery = `
            SELECT id FROM member WHERE id = $1
        `;
        
        const memberResult = await pool.query(memberQuery, [id]);
        
        if (memberResult.rows.length === 0) {
            return res.status(404).json({ message: "Member tidak ditemukan" });
        }
        
        // Get member history
        const historyQuery = `
            SELECT * 
            FROM member_history
            WHERE member_id = $1
            ORDER BY tanggal_transaksi DESC
        `;
        
        const historyResult = await pool.query(historyQuery, [id]);
        
        res.json(historyResult.rows);
    } catch (error) {
        console.error('Error in getMemberHistory:', error);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil history member" });
    }
};

export default {
    getAllMembers,
    getMemberById,
    createMember,
    updateMember,
    deleteMember,
    extendMembership,
    getMemberHistory
};
