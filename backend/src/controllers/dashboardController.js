// dashboardController.js

import pool from '../config/database.js';

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
        let activeMembers = 0;
        try {
            const activeMembersResult = await pool.query(activeMembersQuery);
            activeMembers = parseInt(activeMembersResult.rows[0]?.total || 0);
        } catch (err) {
            console.log('Member table might not exist yet:', err.message);
        }
        
        // Get available fields
        const availableFieldsQuery = `
            SELECT COUNT(*) as total FROM lapangan
            WHERE status = 'tersedia'
        `;
        const availableFieldsResult = await pool.query(availableFieldsQuery);
        const availableFields = parseInt(availableFieldsResult.rows[0].total);
        
        // Get bookings by type
        const bookingsByTypeQuery = `
            SELECT 
                tipe_booking as name,
                COUNT(*) as value
            FROM booking
            GROUP BY tipe_booking
        `;
        const bookingsByTypeResult = await pool.query(bookingsByTypeQuery);
        const bookingsByType = bookingsByTypeResult.rows;
        
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
        const revenueByMonthResult = await pool.query(revenueByMonthQuery);
        const revenueByMonth = revenueByMonthResult.rows;
        
        // Get field utilization
        const fieldUtilizationQuery = `
            SELECT 
                l.nama as name,
                COUNT(b.id) as booking_count,
                COALESCE(SUM(EXTRACT(EPOCH FROM (b.jam_selesai::time - b.jam_mulai::time)) / 3600), 0) as hoursBooked,
                (SELECT COUNT(*) * 12 FROM generate_series(CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE, INTERVAL '1 day')) as hoursAvailable
            FROM lapangan l
            LEFT JOIN booking b ON l.id = b.lapangan_id AND b.tanggal >= NOW() - INTERVAL '30 days'
            GROUP BY l.id, l.nama
        `;
        const fieldUtilizationResult = await pool.query(fieldUtilizationQuery);
        const fieldUtilization = fieldUtilizationResult.rows;
        
        // Get today's bookings
        const todayBookingsQuery = `
            SELECT COUNT(*) as count
            FROM booking
            WHERE tanggal = CURRENT_DATE
            AND status_booking != 'cancelled'
        `;
        const todayResult = await pool.query(todayBookingsQuery);
        const todayBookings = parseInt(todayResult.rows[0].count);
        
        // Get pending bookings
        const pendingBookingsQuery = `
            SELECT COUNT(*) as count
            FROM booking
            WHERE status_booking = 'pending'
        `;
        const pendingResult = await pool.query(pendingBookingsQuery);
        const pendingBookings = parseInt(pendingResult.rows[0].count);
        
        res.json({
            totalBookings,
            totalRevenue,
            activeMembers,
            availableFields,
            bookingsByType,
            revenueByMonth,
            fieldUtilization,
            todayBookings,
            pendingBookings
        });
    } catch (error) {
        console.error('Error in getDashboardStats:', error);
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil data dashboard" });
    }
};

export default {
    getDashboardStats
};
