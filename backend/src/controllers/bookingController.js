// bookingController.js

import pool from '../config/database.js';

// Check ketersediaan lapangan pada tanggal tertentu
export const checkAvailability = async (req, res) => {
    try {
        const { lapangan_id, tanggal } = req.params;
        
        // Query untuk mendapatkan semua booking pada tanggal tersebut
        const result = await pool.query(`
            SELECT jam_mulai, jam_selesai 
            FROM booking 
            WHERE lapangan_id = $1 
            AND tanggal = $2
            AND status_booking != 'cancelled'
        `, [lapangan_id, tanggal]);
        
        // Get waktu_sewa untuk lapangan tersebut
        const waktuSewa = await pool.query(`
            SELECT json_agg(json_build_object(
                'jam_mulai', jam_mulai,
                'jam_selesai', jam_selesai,
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
            availableSlots
        });
    } catch (error) {
        console.error('Error in checkAvailability:', error);
        res.status(500).json({ message: "Terjadi kesalahan saat memeriksa ketersediaan" });
    }
};

// Create booking baru
export const createBooking = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        const { 
            lapangan_id, 
            nama_pemesan, 
            no_telepon, 
            tanggal, 
            jam_mulai, 
            jam_selesai, 
            tipe_booking,
            total_harga,
            catatan 
        } = req.body;
        
        // Validasi ketersediaan
        const checkResult = await client.query(`
            SELECT id FROM booking 
            WHERE lapangan_id = $1 
            AND tanggal = $2 
            AND status_booking != 'cancelled'
            AND (
                (jam_mulai <= $3 AND jam_selesai > $3) OR
                (jam_mulai < $4 AND jam_selesai >= $4) OR
                (jam_mulai >= $3 AND jam_selesai <= $4)
            )
        `, [lapangan_id, tanggal, jam_mulai, jam_selesai]);
        
        if (checkResult.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: "Jadwal sudah dibooking" });
        }
        
        // Insert booking
        const result = await client.query(`
            INSERT INTO booking (
                lapangan_id, nama_pemesan, no_telepon, tanggal, 
                jam_mulai, jam_selesai, tipe_booking, total_harga, catatan
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id
        `, [
            lapangan_id, nama_pemesan, no_telepon, tanggal, 
            jam_mulai, jam_selesai, tipe_booking, total_harga, catatan
        ]);
        
        const bookingId = result.rows[0].id;
        
        // Kirim notifikasi WhatsApp (implementasi nanti)
        // sendWhatsAppNotification(no_telepon, bookingId);
        
        await client.query('COMMIT');
        res.status(201).json({ 
            message: "Booking berhasil dibuat", 
            id: bookingId 
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error in createBooking:', error);
        res.status(500).json({ message: "Terjadi kesalahan saat membuat booking" });
    } finally {
        client.release();
    }
};

// Create event booking
export const createEventBooking = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        const { 
            lapangan_id, 
            nama_pemesan, 
            no_telepon, 
            tanggal_mulai, 
            tanggal_selesai, 
            nama_event,
            deskripsi,
            total_harga,
            catatan 
        } = req.body;
        
        // Validasi durasi event (max 2 hari)
        const startDate = new Date(tanggal_mulai);
        const endDate = new Date(tanggal_selesai);
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays > 2) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: "Event maksimal 2 hari" });
        }
        
        // Validasi ketersediaan
        const checkResult = await client.query(`
            SELECT id FROM booking 
            WHERE lapangan_id = $1 
            AND tanggal BETWEEN $2 AND $3
            AND status_booking != 'cancelled'
        `, [lapangan_id, tanggal_mulai, tanggal_selesai]);
        
        if (checkResult.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: "Terdapat jadwal yang sudah dibooking pada rentang tanggal tersebut" });
        }
        
        // Insert booking
        const bookingResult = await client.query(`
            INSERT INTO booking (
                lapangan_id, nama_pemesan, no_telepon, tanggal, 
                jam_mulai, jam_selesai, tipe_booking, total_harga, catatan
            ) VALUES ($1, $2, $3, $4, '00:00', '23:59', 'event', $5, $6)
            RETURNING id
        `, [
            lapangan_id, nama_pemesan, no_telepon, tanggal_mulai, total_harga, catatan
        ]);
        
        const bookingId = bookingResult.rows[0].id;
        
        // Insert event details
        await client.query(`
            INSERT INTO booking_event (
                booking_id, nama_event, deskripsi, tanggal_mulai, tanggal_selesai
            ) VALUES ($1, $2, $3, $4, $5)
        `, [bookingId, nama_event, deskripsi, tanggal_mulai, tanggal_selesai]);
        
        // Kirim notifikasi WhatsApp (implementasi nanti)
        // sendWhatsAppNotification(no_telepon, bookingId, 'event');
        
        await client.query('COMMIT');
        res.status(201).json({ 
            message: "Booking event berhasil dibuat", 
            id: bookingId 
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error in createEventBooking:', error);
        res.status(500).json({ message: "Terjadi kesalahan saat membuat booking event" });
    } finally {
        client.release();
    }
};

// Get semua booking (untuk admin)
export const getAllBookings = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            tanggal_mulai,
            tanggal_akhir,
            status_booking,
            status_pembayaran,
            tipe_booking,
            search,
            lapangan_id
        } = req.query;
        
        const offset = (page - 1) * limit;
        let params = [];
        let whereClause = [];
        let paramCounter = 1;
        
        // Build WHERE clause based on filters
        if (tanggal_mulai) {
            whereClause.push(`b.tanggal >= $${paramCounter++}`);
            params.push(tanggal_mulai);
        }
        
        if (tanggal_akhir) {
            whereClause.push(`b.tanggal <= $${paramCounter++}`);
            params.push(tanggal_akhir);
        }
        
        if (status_booking) {
            whereClause.push(`b.status_booking = $${paramCounter++}`);
            params.push(status_booking);
        }
        
        if (status_pembayaran) {
            whereClause.push(`b.status_pembayaran = $${paramCounter++}`);
            params.push(status_pembayaran);
        }
        
        if (tipe_booking) {
            whereClause.push(`b.tipe_booking = $${paramCounter++}`);
            params.push(tipe_booking);
        }
        
        if (lapangan_id) {
            whereClause.push(`b.lapangan_id = $${paramCounter++}`);
            params.push(lapangan_id);
        }
        
        if (search) {
            whereClause.push(`(
                b.nama_pemesan ILIKE $${paramCounter} OR 
                b.no_telepon ILIKE $${paramCounter}
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
            FROM booking b
            ${whereString}
        `;
        
        const countResult = await pool.query(countQuery, params);
        const totalItems = parseInt(countResult.rows[0].count);
        const totalPages = Math.ceil(totalItems / limit);
        
        // Get bookings
        const query = `
            SELECT 
                b.*,
                l.nama as lapangan_nama,
                l.tipe as lapangan_tipe,
                CASE 
                    WHEN b.tipe_booking = 'event' THEN (
                        SELECT json_build_object(
                            'nama_event', be.nama_event,
                            'deskripsi', be.deskripsi,
                            'tanggal_mulai', be.tanggal_mulai,
                            'tanggal_selesai', be.tanggal_selesai
                        )
                        FROM booking_event be
                        WHERE be.booking_id = b.id
                    )
                    ELSE NULL
                END as event_details
            FROM booking b
            LEFT JOIN lapangan l ON b.lapangan_id = l.id
            ${whereString}
            ORDER BY b.created_at DESC
            LIMIT $${paramCounter++} OFFSET $${paramCounter++}
        `;
        
        params.push(parseInt(limit), offset);
        
        const result = await pool.query(query, params);
        
        // Format response
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
        console.error('Error in getAllBookings:', error);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil data booking" });
    }
};

// Get detail booking by ID
export const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Get booking details
        const bookingQuery = `
            SELECT 
                b.*,
                l.nama as lapangan_nama,
                l.tipe as lapangan_tipe,
                CASE 
                    WHEN b.tipe_booking = 'event' THEN (
                        SELECT json_build_object(
                            'nama_event', be.nama_event,
                            'deskripsi', be.deskripsi,
                            'tanggal_mulai', be.tanggal_mulai,
                            'tanggal_selesai', be.tanggal_selesai
                        )
                        FROM booking_event be
                        WHERE be.booking_id = b.id
                    )
                    ELSE NULL
                END as event_details
            FROM booking b
            JOIN lapangan l ON b.lapangan_id = l.id
            WHERE b.id = $1
        `;
        
        const bookingResult = await pool.query(bookingQuery, [id]);
        
        if (bookingResult.rows.length === 0) {
            return res.status(404).json({ message: "Booking tidak ditemukan" });
        }
        
        // Get booking history
        const historyQuery = `
            SELECT 
                bh.*,
                a.username as admin_username
            FROM booking_history bh
            LEFT JOIN admin a ON bh.admin_id = a.id
            WHERE bh.booking_id = $1
            ORDER BY bh.created_at DESC
        `;
        
        const historyResult = await pool.query(historyQuery, [id]);
        
        res.json({
            ...bookingResult.rows[0],
            history: historyResult.rows
        });
    } catch (error) {
        console.error('Error in getBookingById:', error);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil detail booking" });
    }
};

// Update status booking
export const updateBookingStatus = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        const { id } = req.params;
        const { status_booking, status_pembayaran, catatan } = req.body;
        const admin_id = req.user.id;
        
        // Get current booking status
        const currentStatusQuery = `
            SELECT status_booking, status_pembayaran, no_telepon
            FROM booking
            WHERE id = $1
        `;
        
        const currentStatusResult = await client.query(currentStatusQuery, [id]);
        
        if (currentStatusResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: "Booking tidak ditemukan" });
        }
        
        const currentStatus = currentStatusResult.rows[0];
        
        // Update booking status
        const updateQuery = `
            UPDATE booking
            SET 
                status_booking = COALESCE($1, status_booking),
                status_pembayaran = COALESCE($2, status_pembayaran),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $3
            RETURNING *
        `;
        
        const updateResult = await client.query(updateQuery, [
            status_booking, 
            status_pembayaran, 
            id
        ]);
        
        // Record history if status changed
        if (status_booking && status_booking !== currentStatus.status_booking) {
            await client.query(`
                INSERT INTO booking_history (
                    booking_id, status_lama, status_baru, catatan, admin_id
                ) VALUES ($1, $2, $3, $4, $5)
            `, [
                id, 
                currentStatus.status_booking, 
                status_booking, 
                catatan, 
                admin_id
            ]);
        }
        
        if (status_pembayaran && status_pembayaran !== currentStatus.status_pembayaran) {
            await client.query(`
                INSERT INTO booking_history (
                    booking_id, status_lama, status_baru, catatan, admin_id
                ) VALUES ($1, $2, $3, $4, $5)
            `, [
                id, 
                `pembayaran_${currentStatus.status_pembayaran}`, 
                `pembayaran_${status_pembayaran}`, 
                catatan, 
                admin_id
            ]);
        }
        
        // Kirim notifikasi WhatsApp jika status berubah
        // if (status_booking && status_booking !== currentStatus.status_booking) {
        //     sendStatusUpdateNotification(currentStatus.no_telepon, id, status_booking);
        // }
        
        await client.query('COMMIT');
        res.json({ 
            message: "Status booking berhasil diupdate", 
            booking: updateResult.rows[0] 
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error in updateBookingStatus:', error);
        res.status(500).json({ message: "Terjadi kesalahan saat mengupdate status booking" });
    } finally {
        client.release();
    }
};

// Delete booking
export const deleteBooking = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        const { id } = req.params;
        
        // Check if booking exists
        const checkQuery = `SELECT id FROM booking WHERE id = $1`;
        const checkResult = await client.query(checkQuery, [id]);
        
        if (checkResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: "Booking tidak ditemukan" });
        }
        
        // Delete booking history
        await client.query(`DELETE FROM booking_history WHERE booking_id = $1`, [id]);
        
        // Delete event booking if exists
        await client.query(`DELETE FROM booking_event WHERE booking_id = $1`, [id]);
        
        // Delete booking
        await client.query(`DELETE FROM booking WHERE id = $1`, [id]);
        
        await client.query('COMMIT');
        res.json({ message: "Booking berhasil dihapus" });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error in deleteBooking:', error);
        res.status(500).json({ message: "Terjadi kesalahan saat menghapus booking" });
    } finally {
        client.release();
    }
};

// Get dashboard stats
export const getDashboardStats = async (req, res) => {
    try {
        // Get total bookings
        const totalBookingsQuery = `
            SELECT COUNT(*) as total FROM booking
        `;
        const totalBookingsResult = await pool.query(totalBookingsQuery);
        const totalBookings = parseInt(totalBookingsResult.rows[0].total);
        
        // Get total revenue
        const totalRevenueQuery = `
            SELECT COALESCE(SUM(total_harga), 0) as total FROM booking
            WHERE status_pembayaran = 'lunas'
        `;
        const totalRevenueResult = await pool.query(totalRevenueQuery);
        const totalRevenue = parseFloat(totalRevenueResult.rows[0].total);
        
        // Get active members
        const activeMembersQuery = `
            SELECT COUNT(*) as total FROM member
            WHERE status = 'aktif'
        `;
        const activeMembersResult = await pool.query(activeMembersQuery);
        const activeMembers = parseInt(activeMembersResult.rows[0]?.total || 0);
        
        // Get available fields
        const availableFieldsQuery = `
            SELECT COUNT(*) as total FROM lapangan
            WHERE status = 'tersedia'
        `;
        const availableFieldsResult = await pool.query(availableFieldsQuery);
        const availableFields = parseInt(availableFieldsResult.rows[0]?.total || 0);
        
        // Get today's bookings
        const todayBookingsQuery = `
            SELECT COUNT(*) as count FROM booking
            WHERE tanggal = CURRENT_DATE
        `;
        
        // Get pending bookings
        const pendingBookingsQuery = `
            SELECT COUNT(*) as count FROM booking
            WHERE status_booking = 'pending'
        `;
        
        // Get weekly bookings
        const weeklyBookingsQuery = `
            SELECT COUNT(*) as count FROM booking
            WHERE tanggal BETWEEN 
                CURRENT_DATE - INTERVAL '7 days' AND CURRENT_DATE
        `;
        
        // Get bookings by field
        const bookingsByFieldQuery = `
            SELECT 
                l.nama as lapangan_nama,
                COUNT(b.id) as total_bookings
            FROM booking b
            JOIN lapangan l ON b.lapangan_id = l.id
            WHERE b.tanggal BETWEEN 
                CURRENT_DATE - INTERVAL '30 days' AND CURRENT_DATE
            AND b.status_booking != 'cancelled'
            GROUP BY l.nama
        `;
        
        // Get bookings by type
        const bookingsByTypeQuery = `
            SELECT 
                CASE 
                    WHEN tipe_booking = 'regular' THEN 'regular'
                    WHEN tipe_booking = 'event' THEN 'event'
                    ELSE tipe_booking
                END as name,
                COUNT(*) as value
            FROM booking
            GROUP BY tipe_booking
        `;
        
        // Get revenue by month (last 6 months)
        const revenueByMonthQuery = `
            SELECT 
                TO_CHAR(tanggal, 'Month') as month,
                EXTRACT(MONTH FROM tanggal) as month_num,
                EXTRACT(YEAR FROM tanggal) as year,
                SUM(total_harga) as revenue
            FROM booking
            WHERE tanggal >= NOW() - INTERVAL '6 months'
            AND status_pembayaran = 'lunas'
            GROUP BY month, month_num, year
            ORDER BY year, month_num
        `;
        
        const [
            todayResult, 
            pendingResult, 
            weeklyResult, 
            byFieldResult,
            bookingsByTypeResult,
            revenueByMonthResult
        ] = await Promise.all([
            pool.query(todayBookingsQuery),
            pool.query(pendingBookingsQuery),
            pool.query(weeklyBookingsQuery),
            pool.query(bookingsByFieldQuery),
            pool.query(bookingsByTypeQuery),
            pool.query(revenueByMonthQuery)
        ]);
        
        res.json({
            totalBookings,
            totalRevenue,
            activeMembers,
            availableFields,
            todayBookings: parseInt(todayResult.rows[0].count),
            pendingBookings: parseInt(pendingResult.rows[0].count),
            weeklyBookings: parseInt(weeklyResult.rows[0].count),
            bookingsByField: byFieldResult.rows,
            bookingsByType: bookingsByTypeResult.rows,
            revenueByMonth: revenueByMonthResult.rows
        });
    } catch (error) {
        console.error('Error in getDashboardStats:', error);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil statistik dashboard" });
    }
};

// Get booking regular (untuk admin)
export const getRegularBookings = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            tanggal_mulai,
            tanggal_akhir,
            status_booking,
            status_pembayaran,
            search,
            lapangan_id
        } = req.query;
        
        const offset = (page - 1) * limit;
        let params = [];
        let whereClause = ['b.tipe_booking = $1'];
        let paramCounter = 2;
        
        params.push('regular');
        
        // Build WHERE clause based on filters
        if (tanggal_mulai) {
            whereClause.push(`b.tanggal >= $${paramCounter++}`);
            params.push(tanggal_mulai);
        }
        
        if (tanggal_akhir) {
            whereClause.push(`b.tanggal <= $${paramCounter++}`);
            params.push(tanggal_akhir);
        }
        
        if (status_booking) {
            whereClause.push(`b.status_booking = $${paramCounter++}`);
            params.push(status_booking);
        }
        
        if (status_pembayaran) {
            whereClause.push(`b.status_pembayaran = $${paramCounter++}`);
            params.push(status_pembayaran);
        }
        
        if (lapangan_id) {
            whereClause.push(`b.lapangan_id = $${paramCounter++}`);
            params.push(lapangan_id);
        }
        
        if (search) {
            whereClause.push(`(
                b.nama_pemesan ILIKE $${paramCounter} OR 
                b.no_telepon ILIKE $${paramCounter}
            )`);
            params.push(`%${search}%`);
            paramCounter++;
        }
        
        const whereString = 'WHERE ' + whereClause.join(' AND ');
        
        // Get total count
        const countQuery = `
            SELECT COUNT(*) 
            FROM booking b
            ${whereString}
        `;
        
        const countResult = await pool.query(countQuery, params);
        const totalItems = parseInt(countResult.rows[0].count);
        const totalPages = Math.ceil(totalItems / limit);
        
        // Get bookings
        const query = `
            SELECT 
                b.*,
                l.nama as lapangan_nama,
                l.tipe as lapangan_tipe
            FROM booking b
            LEFT JOIN lapangan l ON b.lapangan_id = l.id
            ${whereString}
            ORDER BY b.created_at DESC
            LIMIT $${paramCounter++} OFFSET $${paramCounter++}
        `;
        
        params.push(parseInt(limit), offset);
        
        const result = await pool.query(query, params);
        
        // Format response
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
        console.error('Error in getRegularBookings:', error);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil data booking regular" });
    }
};

// Get booking event (untuk admin)
export const getEventBookings = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            tanggal_mulai,
            tanggal_akhir,
            status_booking,
            status_pembayaran,
            search,
            lapangan_id
        } = req.query;
        
        const offset = (page - 1) * limit;
        let params = [];
        let whereClause = ['b.tipe_booking = $1'];
        let paramCounter = 2;
        
        params.push('event');
        
        // Build WHERE clause based on filters
        if (tanggal_mulai) {
            whereClause.push(`be.tanggal_mulai >= $${paramCounter++}`);
            params.push(tanggal_mulai);
        }
        
        if (tanggal_akhir) {
            whereClause.push(`be.tanggal_selesai <= $${paramCounter++}`);
            params.push(tanggal_akhir);
        }
        
        if (status_booking) {
            whereClause.push(`b.status_booking = $${paramCounter++}`);
            params.push(status_booking);
        }
        
        if (status_pembayaran) {
            whereClause.push(`b.status_pembayaran = $${paramCounter++}`);
            params.push(status_pembayaran);
        }
        
        if (lapangan_id) {
            whereClause.push(`b.lapangan_id = $${paramCounter++}`);
            params.push(lapangan_id);
        }
        
        if (search) {
            whereClause.push(`(
                b.nama_pemesan ILIKE $${paramCounter} OR 
                b.no_telepon ILIKE $${paramCounter} OR
                be.nama_event ILIKE $${paramCounter}
            )`);
            params.push(`%${search}%`);
            paramCounter++;
        }
        
        const whereString = 'WHERE ' + whereClause.join(' AND ');
        
        // Get total count
        const countQuery = `
            SELECT COUNT(*) 
            FROM booking b
            JOIN booking_event be ON b.id = be.booking_id
            ${whereString}
        `;
        
        const countResult = await pool.query(countQuery, params);
        const totalItems = parseInt(countResult.rows[0].count);
        const totalPages = Math.ceil(totalItems / limit);
        
        // Get bookings
        const query = `
            SELECT 
                b.*,
                l.nama as lapangan_nama,
                l.tipe as lapangan_tipe,
                be.nama_event,
                be.deskripsi as event_deskripsi,
                be.tanggal_mulai,
                be.tanggal_selesai
            FROM booking b
            LEFT JOIN lapangan l ON b.lapangan_id = l.id
            JOIN booking_event be ON b.id = be.booking_id
            ${whereString}
            ORDER BY b.created_at DESC
            LIMIT $${paramCounter++} OFFSET $${paramCounter++}
        `;
        
        params.push(parseInt(limit), offset);
        
        const result = await pool.query(query, params);
        
        // Format response
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
        console.error('Error in getEventBookings:', error);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil data booking event" });
    }
};

// Update booking (lengkap)
export const updateBooking = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        const { id } = req.params;
        const { 
            nama_pemesan, 
            no_telepon, 
            tanggal, 
            jam_mulai, 
            jam_selesai,
            total_harga,
            catatan,
            status_booking,
            status_pembayaran,
            lapangan_id
        } = req.body;
        
        // Cek apakah booking ada
        const checkBooking = await client.query('SELECT * FROM booking WHERE id = $1', [id]);
        
        if (checkBooking.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: "Booking tidak ditemukan" });
        }
        
        // Update booking
        const updateQuery = `
            UPDATE booking
            SET 
                nama_pemesan = COALESCE($1, nama_pemesan),
                no_telepon = COALESCE($2, no_telepon),
                tanggal = COALESCE($3, tanggal),
                jam_mulai = COALESCE($4, jam_mulai),
                jam_selesai = COALESCE($5, jam_selesai),
                total_harga = COALESCE($6, total_harga),
                catatan = COALESCE($7, catatan),
                status_booking = COALESCE($8, status_booking),
                status_pembayaran = COALESCE($9, status_pembayaran),
                lapangan_id = COALESCE($10, lapangan_id),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $11
            RETURNING *
        `;
        
        const updateResult = await client.query(updateQuery, [
            nama_pemesan, 
            no_telepon, 
            tanggal, 
            jam_mulai, 
            jam_selesai,
            total_harga,
            catatan,
            status_booking,
            status_pembayaran,
            lapangan_id,
            id
        ]);
        
        // Tambahkan log perubahan
        if (req.admin && req.admin.id) {
            await client.query(`
                INSERT INTO booking_history (
                    booking_id, status_lama, status_baru, catatan, admin_id
                ) VALUES ($1, $2, $3, $4, $5)
            `, [
                id, 
                'update', 
                'update', 
                'Booking diperbarui', 
                req.admin.id
            ]);
        }
        
        await client.query('COMMIT');
        res.json({ 
            message: "Booking berhasil diupdate", 
            booking: updateResult.rows[0] 
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error in updateBooking:', error);
        res.status(500).json({ message: "Terjadi kesalahan saat mengupdate booking" });
    } finally {
        client.release();
    }
};

// Get jadwal lapangan untuk seminggu
export const getWeeklySchedule = async (req, res) => {
    try {
        // Generate tanggal untuk 7 hari ke depan
        const dates = [];
        const today = new Date();
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            dates.push(date.toISOString().split('T')[0]);
        }
        
        // Get semua lapangan
        const lapanganResult = await pool.query(`
            SELECT id, nama, tipe, nomor_lapangan 
            FROM lapangan 
            ORDER BY tipe, nomor_lapangan
        `);
        
        const lapangan = lapanganResult.rows;
        
        // Get semua waktu sewa
        const waktuSewaResult = await pool.query(`
            SELECT lapangan_id, json_agg(
                json_build_object(
                    'jam_mulai', jam_mulai,
                    'jam_selesai', jam_selesai,
                    'harga', harga
                ) ORDER BY jam_mulai
            ) as time_slots
            FROM waktu_sewa
            GROUP BY lapangan_id
        `);
        
        const waktuSewaMap = {};
        waktuSewaResult.rows.forEach(row => {
            waktuSewaMap[row.lapangan_id] = row.time_slots;
        });
        
        // Get semua booking untuk 7 hari ke depan
        const bookingResult = await pool.query(`
            SELECT lapangan_id, tanggal, jam_mulai, jam_selesai, status_booking
            FROM booking
            WHERE tanggal >= $1 AND tanggal <= $2
            AND status_booking != 'cancelled'
            ORDER BY tanggal, jam_mulai
        `, [dates[0], dates[6]]);
        
        // Organize bookings by date and field
        const bookingMap = {};
        
        bookingResult.rows.forEach(booking => {
            if (!bookingMap[booking.tanggal]) {
                bookingMap[booking.tanggal] = {};
            }
            
            if (!bookingMap[booking.tanggal][booking.lapangan_id]) {
                bookingMap[booking.tanggal][booking.lapangan_id] = [];
            }
            
            bookingMap[booking.tanggal][booking.lapangan_id].push({
                jam_mulai: booking.jam_mulai,
                jam_selesai: booking.jam_selesai,
                status: booking.status_booking
            });
        });
        
        // Prepare response
        const schedule = lapangan.map(field => {
            const timeSlots = waktuSewaMap[field.id] || [];
            
            const dailySchedule = dates.map(date => {
                const bookings = (bookingMap[date] && bookingMap[date][field.id]) || [];
                
                // Mark each time slot as available or booked
                const slots = timeSlots.map(slot => {
                    const isBooked = bookings.some(booking => 
                        booking.jam_mulai === slot.jam_mulai && 
                        booking.jam_selesai === slot.jam_selesai
                    );
                    
                    return {
                        ...slot,
                        status: isBooked ? 'booked' : 'available'
                    };
                });
                
                return {
                    date,
                    day: new Date(date).toLocaleDateString('id-ID', { weekday: 'long' }),
                    slots
                };
            });
            
            return {
                id: field.id,
                nama: field.nama,
                tipe: field.tipe,
                nomor_lapangan: field.nomor_lapangan,
                schedule: dailySchedule
            };
        });
        
        res.json({
            dates,
            fields: schedule
        });
    } catch (error) {
        console.error('Error in getWeeklySchedule:', error);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil jadwal lapangan" });
    }
};

export default {
    checkAvailability,
    createBooking,
    createEventBooking,
    getAllBookings,
    getBookingById,
    updateBookingStatus,
    deleteBooking,
    getDashboardStats,
    getRegularBookings,
    getEventBookings,
    updateBooking,
    getWeeklySchedule
};