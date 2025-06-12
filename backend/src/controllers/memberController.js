import pool from '../config/database.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Fungsi untuk membuat token JWT
const generateToken = (member) => {
    return jwt.sign(
        { id: member.id, email: member.email, role: 'member' },
        process.env.JWT_SECRET || 'secret_key',
        { expiresIn: '7d' }
    );
};

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
        let whereClause = ["l.tipe = 'bulutangkis'"];
        let paramCounter = 1;
        
        // Filter berdasarkan status
        if (status) {
            whereClause.push(`m.status = $${paramCounter++}`);
            params.push(status);
        }
        
        // Filter berdasarkan search
        if (search) {
            whereClause.push(`(
                m.nama ILIKE $${paramCounter} OR 
                m.email ILIKE $${paramCounter}
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
            FROM member m
            LEFT JOIN lapangan l ON m.lapangan_id = l.id
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
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        console.log('Create member request body:', req.body);
        
        const { 
            nama, 
            no_telepon, 
            email,
            password,
            lapangan_id,
            tanggal_mulai, 
            tanggal_berakhir,
            jam_sewa = '19:00:00',
            status = 'aktif'
        } = req.body;
        
        // Validasi data wajib
        if (!nama || !email || !password || !lapangan_id || !tanggal_mulai || !tanggal_berakhir) {
            return res.status(400).json({ 
                message: "Nama, email, password, lapangan, dan periode membership wajib diisi" 
            });
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Check if email already exists
        const checkEmail = await client.query(
            'SELECT id FROM member WHERE email = $1',
            [email]
        );

        if (checkEmail.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({
                message: "Email sudah terdaftar"
            });
        }
        
        // Validasi lapangan exists
        const checkLapangan = await client.query(
            'SELECT id FROM lapangan WHERE id = $1',
            [lapangan_id]
        );

        if (checkLapangan.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                message: "Lapangan tidak ditemukan"
            });
        }
        
        // Insert member
        const query = `
            INSERT INTO member (
                nama, 
                no_telepon, 
                email,
                password,
                lapangan_id,
                tanggal_mulai,
                tanggal_berakhir,
                jam_sewa,
                status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id
        `;
        
        const params = [
            nama, 
            no_telepon || null,
            email,
            hashedPassword,
            parseInt(lapangan_id),
            tanggal_mulai,
            tanggal_berakhir,
            jam_sewa,
            status
        ];
        
        console.log('Inserting member with params:', params);
        const result = await client.query(query, params);
        
        await client.query('COMMIT');

        res.status(201).json({ 
            message: "Member berhasil ditambahkan", 
            id: result.rows[0].id 
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error in createMember:', error);
        res.status(500).json({ 
            message: "Terjadi kesalahan saat menambahkan member",
            error: error.message 
        });
    } finally {
        client.release();
    }
};

// Update member
export const updateMember = async (req, res) => {
    try {
        console.log('Update member request body:', req.body);
        
        const { id } = req.params;
        const { 
            nama, 
            no_telepon, 
            email, 
            tanggal_mulai, 
            tanggal_berakhir,
            lapangan_id,
            status
        } = req.body;
        
        // Validasi ID
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({ message: "ID member tidak valid" });
        }
        
        // Pastikan lapangan_id adalah angka jika ada
        const fieldId = lapangan_id ? parseInt(lapangan_id) : null;
        
        // Check if email is already used by another member
        if (email) {
            const emailCheck = await pool.query(
                'SELECT id FROM member WHERE email = $1 AND id != $2',
                [email, id]
            );
            if (emailCheck.rows.length > 0) {
                return res.status(400, { message: "Email sudah digunakan oleh member lain" });
            }
        }

        // Update member
        const query = `
            UPDATE member
            SET 
                nama = COALESCE($1, nama),
                no_telepon = COALESCE($2, no_telepon),
                email = COALESCE($3, email),
                tanggal_mulai = COALESCE($4, tanggal_mulai),
                tanggal_berakhir = COALESCE($5, tanggal_berakhir),
                lapangan_id = COALESCE($6, lapangan_id),
                status = COALESCE($7, status),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $8
            RETURNING *
        `;
        
        const result = await pool.query(query, [
            nama, 
            no_telepon, 
            email, 
            tanggal_mulai, 
            tanggal_berakhir,
            lapangan_id ? parseInt(lapangan_id) : null,
            status, 
            id
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
        const { tanggal_berakhir, biaya_perpanjangan } = req.body;
        
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
        const currentEndDate = new Date(member.tanggal_berakhir);
        const newEndDate = new Date(tanggal_berakhir);
        
        if (newEndDate <= currentEndDate) {
            return res.status(400).json({ 
                message: "Tanggal berakhir baru harus setelah tanggal berakhir saat ini" 
            });
        }
        
        // Update member with new end date
        const updateQuery = `
            UPDATE member
            SET 
                tanggal_berakhir = $1,
                status = 'aktif',
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING *
        `;
        
        const updateResult = await pool.query(updateQuery, [tanggal_berakhir, id]);
        
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
        
        const keterangan = `Perpanjangan membership dari ${member.tanggal_berakhir} hingga ${tanggal_berakhir}`;
        
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

// Registrasi member baru (untuk publik)
export const registerMember = async (req, res) => {
    try {
        const { 
            nama, 
            no_telepon, 
            email, 
            password,
            lapangan_id,
            tanggal_mulai,
            tanggal_berakhir,   
            jam_sewa,
            status = 'aktif',
            jenis_membership = 'bulanan'
        } = req.body;
        
        // Validasi data wajib
        if (!nama || !email || !password) {
            return res.status(400).json({ message: "Nama, email, dan password wajib diisi" });
        }
        
        // Cek apakah email sudah terdaftar
        const checkEmailQuery = `SELECT id FROM member WHERE email = $1`;
        const emailResult = await pool.query(checkEmailQuery, [email]);
        
        if (emailResult.rows.length > 0) {
            return res.status(400).json({ message: "Email sudah terdaftar" });
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Validasi tanggal
        let startDate, endDate;
        if (tanggal_mulai) {
            startDate = new Date(tanggal_mulai);
        } else {
            startDate = new Date();
        }
        
        if (tanggal_berakhir) {
            endDate = new Date(tanggal_berakhir);
        } else {
            endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + 1);
        }
        
        const formattedStartDate = startDate.toISOString().split('T')[0];
        const formattedEndDate = endDate.toISOString().split('T')[0];
        
        // Insert member
        const query = `
            INSERT INTO member (
                nama, 
                no_telepon, 
                email, 
                password, 
                lapangan_id, 
                tanggal_mulai, 
                tanggal_berakhir,
                jam_sewa, 
                status, 
                jenis_membership,
                created_at,
                updated_at
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            )
            RETURNING *
        `;
        
        const result = await pool.query(query, [
            nama, 
            no_telepon || null,
            email,
            hashedPassword,
            lapangan_id,
            formattedStartDate, 
            formattedEndDate,
            jam_sewa,
            status,
            jenis_membership
        ]);
        
        const member = result.rows[0];
        
        // Generate token
        const token = generateToken(member);
        
        res.status(201).json({
            message: "Registrasi berhasil",
            member,
            token
        });
    } catch (error) {
        console.error('Error in registerMember:', error);
        res.status(500).json({ message: "Terjadi kesalahan saat registrasi member" })
    }
};

// Login member
export const loginMember = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validasi data wajib
        if (!email || !password) {
            return res.status(400).json({ message: "Email dan password wajib diisi" });
        }
        
        // Query untuk mencari member berdasarkan email
        const query = `
            SELECT id, nama, email, password, no_telepon, tanggal_mulai, tanggal_berakhir, status, jam_sewa
            FROM member 
            WHERE email = $1
        `;
        const params = [email];
        
        const result = await pool.query(query, params);
        
        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Email atau password salah" });
        }
        
        const member = result.rows[0];
        
        // Cek password
        const isMatch = await bcrypt.compare(password, member.password);
        
        if (!isMatch) {
            return res.status(401).json({ message: "Email atau password salah" });
        }
        
        // Cek status member
        if (member.status !== 'aktif') {
            return res.status(401).json({ message: "Membership Anda tidak aktif" });
        }
        
        // Cek apakah membership sudah berakhir
        const today = new Date();
        const endDate = new Date(member.tanggal_berakhir);
        
        if (today > endDate) {
            // Update status member menjadi tidak aktif
            await pool.query(
                `UPDATE member SET status = 'tidak aktif' WHERE id = $1`,
                [member.id]
            );
            
            return res.status(401).json({ 
                message: "Membership Anda telah berakhir. Silakan perpanjang membership Anda.",
                expired: true
            });
        }
        
        // Generate token
        const token = generateToken(member);
        
        // Hapus password dari response
        delete member.password;
        
        res.json({
            message: "Login berhasil",
            member,
            token
        });
    } catch (error) {
        console.error('Error in loginMember:', error);
        res.status(500).json({ message: "Terjadi kesalahan saat login" });
    }
};

// Get member profile
export const getMemberProfile = async (req, res) => {
    try {
        const memberId = req.user.id; // Diambil dari token setelah otentikasi

        const query = `
            SELECT 
                m.id, 
                m.nama, 
                m.email, 
                m.no_telepon, 
                m.tanggal_mulai, 
                m.tanggal_berakhir, 
                m.jam_sewa, 
                m.status,
                l.nama AS lapangan_nama,
                l.tipe AS lapangan_tipe
            FROM member m
            LEFT JOIN lapangan l ON m.lapangan_id = l.id
            WHERE m.id = $1
        `;

        const result = await pool.query(query, [memberId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Profil member tidak ditemukan" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error in getMemberProfile:', error);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil profil member" });
    }
};

// Check ketersediaan lapangan untuk member
export const checkMemberAvailability = async (req, res) => {
    try {
        const { lapangan_id, tanggal } = req.params;
        
        // Query untuk mendapatkan semua booking pada tanggal tersebut
        const result = await pool.query(`
            SELECT jam_mulai, jam_berakhir 
            FROM booking 
            WHERE lapangan_id = $1 
            AND tanggal = $2
            AND status_booking != 'cancelled'
        `, [lapangan_id, tanggal]);
        
        // Get waktu_sewa untuk lapangan tersebut
        const waktuSewa = await pool.query(`
            SELECT json_agg(json_build_object(
               

 'jam_mulai', jam_mulai,
                'jam_berakhir', jam_berakhir,
                'harga', harga
            )) as waktu_sewa
            FROM waktu_sewa
            WHERE lapangan_id = $1
            GROUP BY lapangan_id
        `, [lapangan_id]);
        
        // Format response
        const bookedSlots = result.rows;
        const availableSlots = waktuSewa.rows[0]?.waktu_sewa || [];
        
        res.json({
            tanggal,
            lapangan_id,
            bookedSlots,
            availableSlots,
            memberPrice: true // Menandakan bahwa ini adalah harga untuk member
        });
    } catch (error) {
        console.error('Error in checkMemberAvailability:', error);
        res.status(500).json({ message: "Terjadi kesalahan saat memeriksa ketersediaan" });
    }
};



// Update profile member
export const updateMemberProfile = async (req, res) => {
    try {
        const memberId = req.user.id;
        const { nama, no_telepon, email, current_password, new_password } = req.body;
        
        // Get current member data
        const memberQuery = `SELECT * FROM member WHERE id = $1`;
        const memberResult = await pool.query(memberQuery, [memberId]);
        
        if (memberResult.rows.length === 0) {
            return res.status(404).json({ message: "Member tidak ditemukan" });
        }
        
        const member = memberResult.rows[0];
        
        // Prepare update fields
        let updateFields = [];
        let params = [];
        let paramCounter = 1;
        
        if (nama) {
            updateFields.push(`nama = $${paramCounter++}`);
            params.push(nama);
        }
        
        if (no_telepon) {
            updateFields.push(`no_telepon = $${paramCounter++}`);
            params.push(no_telepon);
        }
        
        if (email) {
            // Check if email is already used by another member
            const emailCheckQuery = `SELECT id FROM member WHERE email = $1 AND id != $2`;
            const emailCheckResult = await pool.query(emailCheckQuery, [email, memberId]);
            
            if (emailCheckResult.rows.length > 0) {
                return res.status(400).json({ message: "Email sudah digunakan oleh member lain" });
            }
            
            updateFields.push(`email = $${paramCounter++}`);
            params.push(email);
        }
        
        // Update password if provided
        if (current_password && new_password) {
            // Verify current password
            const isMatch = await bcrypt.compare(current_password, member.password);
            
            if (!isMatch) {
                return res.status(401).json({ message: "Password saat ini salah" });
            }
            
            // Hash new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(new_password, salt);
            
            updateFields.push(`password = $${paramCounter++}`);
            params.push(hashedPassword);
        }
        
        if (updateFields.length === 0) {
            return res.status(400).json({ message: "Tidak ada data yang diupdate" });
        }
        
        // Add updated_at field
        updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
        
        // Add memberId as the last parameter
        params.push(memberId);
        
        // Update member
        const updateQuery = `
            UPDATE member
            SET ${updateFields.join(', ')}
            WHERE id = $${paramCounter}
            RETURNING id, nama, email, no_telepon, tanggal_mulai, tanggal_berakhir, status
        `;
        
        const updateResult = await pool.query(updateQuery, params);
        
        res.json({
            message: "Profile berhasil diupdate",
            member: updateResult.rows[0]
        });
    } catch (error) {
        console.error('Error in updateMemberProfile:', error);
        res.status(500).json({ message: "Terjadi kesalahan saat mengupdate profile" });
    }
};

// Get bookings for member
export const getMemberBookings = async (req, res) => {
    try {
        const memberId = req.user.id;
        
        // Pertama, dapatkan nama member dari ID-nya
        const memberQuery = 'SELECT nama FROM member WHERE id = $1';
        const memberResult = await pool.query(memberQuery, [memberId]);

        if (memberResult.rows.length === 0) {
            return res.status(404).json({ message: "Member tidak ditemukan" });
        }

        const memberName = memberResult.rows[0].nama;

        // Kemudian, cari booking berdasarkan nama pemesan
        const bookingQuery = `
            SELECT b.*, l.nama as lapangan_nama, l.tipe as lapangan_tipe
            FROM booking b
            JOIN lapangan l ON b.lapangan_id = l.id
            WHERE b.nama_pemesan = $1
            ORDER BY b.tanggal DESC, b.jam_mulai ASC
        `;
        
        const result = await pool.query(bookingQuery, [memberName]);
        
        res.json(result.rows);
    } catch (error) {
        console.error('Error in getMemberBookings:', error);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil data booking" });
    }
};

export default {
    getAllMembers,
    getMemberById,
    createMember,
    updateMember,
    deleteMember,
    extendMembership,
    getMemberHistory,
    registerMember,
    loginMember,
    checkMemberAvailability,
    getMemberProfile,
    updateMemberProfile,
    getMemberBookings
};