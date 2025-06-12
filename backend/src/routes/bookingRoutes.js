import express from 'express';
import bookingController from '../controllers/bookingController.js';
import { isAdminAuthenticated } from '../middleware/auth.js';

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
router.get('/admin', isAdminAuthenticated, bookingController.getAllBookings);
router.get('/admin/regular', isAdminAuthenticated, bookingController.getRegularBookings);
router.get('/admin/event', isAdminAuthenticated, bookingController.getEventBookings);
router.get('/admin/:id', isAdminAuthenticated, bookingController.getBookingById);
router.put('/admin/:id/status', isAdminAuthenticated, bookingController.updateBookingStatus);
router.put('/admin/:id', isAdminAuthenticated, bookingController.updateBooking); // Endpoint baru untuk update booking
router.delete('/admin/:id', isAdminAuthenticated, bookingController.deleteBooking);
router.get('/admin/dashboard/stats', isAdminAuthenticated, bookingController.getDashboardStats);

// Endpoint untuk frontend (lebih sederhana)
router.get('/', isAdminAuthenticated, bookingController.getAllBookings);
router.get('/:id', isAdminAuthenticated, bookingController.getBookingById);
router.put('/:id', isAdminAuthenticated, bookingController.updateBooking); // Update booking
router.put('/:id/status', isAdminAuthenticated, bookingController.updateBookingStatus); // Update status booking
router.delete('/:id', isAdminAuthenticated, bookingController.deleteBooking);

export default router;