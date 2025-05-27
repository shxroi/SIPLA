import express from 'express';
import memberController from '../controllers/memberController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Public routes untuk registrasi dan login member
router.post('/register', memberController.registerMember);
router.post('/login', memberController.loginMember);
router.get('/check-availability/:lapangan_id/:tanggal', memberController.checkMemberAvailability);

// Routes untuk member yang sudah login
router.get('/profile', isAuthenticated, memberController.getMemberProfile);
router.put('/profile', isAuthenticated, memberController.updateMemberProfile);
router.get('/bookings', isAuthenticated, memberController.getMemberBookings);

// Routes (memerlukan autentikasi admin)
router.get('/', isAuthenticated, memberController.getAllMembers);
router.get('/:id', isAuthenticated, memberController.getMemberById);
router.post('/', isAuthenticated, memberController.createMember);
router.put('/:id', isAuthenticated, memberController.updateMember);
router.delete('/:id', isAuthenticated, memberController.deleteMember);
router.post('/:id/extend', isAuthenticated, memberController.extendMembership);
router.get('/:id/history', isAuthenticated, memberController.getMemberHistory);

export default router;
