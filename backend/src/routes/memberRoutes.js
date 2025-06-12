import express from 'express';
import {
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
} from '../controllers/memberController.js';
import { isMemberAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', registerMember);
router.post('/login', loginMember);

// Member-only routes
router.get('/profile', isMemberAuthenticated, getMemberProfile);
router.put('/profile', isMemberAuthenticated, updateMemberProfile);
router.get('/bookings', isMemberAuthenticated, getMemberBookings);
router.get('/availability/:lapangan_id/:tanggal', isMemberAuthenticated, checkMemberAvailability);

export default router;