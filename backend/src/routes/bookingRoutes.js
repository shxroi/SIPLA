import express from 'express';
import bookingController from '../controllers/bookingController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Public endpoints (untuk user)
router.get('/availability/:lapangan_id/:tanggal', bookingController.checkAvailability);
router.post('/create', bookingController.createBooking);
router.post('/event/create', bookingController.createEventBooking);

// Admin endpoints (perlu autentikasi)
router.get('/admin', isAuthenticated, bookingController.getAllBookings);
router.get('/admin/:id', isAuthenticated, bookingController.getBookingById);
router.put('/admin/:id/status', isAuthenticated, bookingController.updateBookingStatus);
router.delete('/admin/:id', isAuthenticated, bookingController.deleteBooking);
router.get('/admin/dashboard/stats', isAuthenticated, bookingController.getDashboardStats);

export default router;