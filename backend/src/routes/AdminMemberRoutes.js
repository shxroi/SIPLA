import express from 'express';
import memberController from '../controllers/memberController.js';
import { isAdminAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Public routes untuk registrasi dan login member
router.post('/register', memberController.registerMember);
router.post('/login', memberController.loginMember);
router.get('/check-availability/:lapangan_id/:tanggal', memberController.checkMemberAvailability);

// Routes untuk member yang sudah login
router.get('/profile', isAdminAuthenticated, memberController.getMemberProfile);
router.put('/profile', isAdminAuthenticated, memberController.updateMemberProfile);
router.get('/bookings', isAdminAuthenticated, memberController.getMemberBookings);

// Routes (memerlukan autentikasi admin)
router.get('/', isAdminAuthenticated, memberController.getAllMembers);
router.get('/:id', isAdminAuthenticated, memberController.getMemberById);
router.post('/', isAdminAuthenticated, memberController.createMember);
router.put('/:id', isAdminAuthenticated, memberController.updateMember);
router.delete('/:id', isAdminAuthenticated, memberController.deleteMember);
router.post('/:id/extend', isAdminAuthenticated, memberController.extendMembership);
router.get('/:id/history', isAdminAuthenticated, memberController.getMemberHistory);

export default router;