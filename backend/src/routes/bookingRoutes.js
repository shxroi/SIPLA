import express from 'express';
import bookingController from '../controllers/bookingController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Public endpoints (untuk user)
router.get('/availability/:lapangan_id/:tanggal', bookingController.checkAvailability);
router.get('/weekly-schedule', bookingController.getWeeklySchedule);

// Endpoint untuk booking (bisa diakses admin dan user)
router.post('/', bookingController.createBooking); // Endpoint untuk frontend
router.post('/create', bookingController.createBooking); // Endpoint lama (untuk kompatibilitas)
router.post('/event', bookingController.createEventBooking); // Endpoint untuk frontend
router.post('/event/create', bookingController.createEventBooking); // Endpoint lama (untuk kompatibilitas)

// Admin endpoints (perlu autentikasi)
router.get('/admin', isAuthenticated, bookingController.getAllBookings);
router.get('/admin/regular', isAuthenticated, bookingController.getRegularBookings);
router.get('/admin/event', isAuthenticated, bookingController.getEventBookings);
router.get('/admin/:id', isAuthenticated, bookingController.getBookingById);
router.put('/admin/:id/status', isAuthenticated, bookingController.updateBookingStatus);
router.put('/admin/:id', isAuthenticated, bookingController.updateBooking); // Endpoint baru untuk update booking
router.delete('/admin/:id', isAuthenticated, bookingController.deleteBooking);
router.get('/admin/dashboard/stats', isAuthenticated, bookingController.getDashboardStats);

// Endpoint untuk frontend (lebih sederhana)
router.get('/', isAuthenticated, bookingController.getAllBookings);
router.get('/:id', isAuthenticated, bookingController.getBookingById);
router.put('/:id', isAuthenticated, bookingController.updateBooking); // Update booking
router.put('/:id/status', isAuthenticated, bookingController.updateBookingStatus); // Update status booking
router.delete('/:id', isAuthenticated, bookingController.deleteBooking);

export default router;