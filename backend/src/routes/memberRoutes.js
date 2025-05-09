import express from 'express';
import memberController from '../controllers/memberController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Routes (semua memerlukan autentikasi admin)
router.get('/', isAuthenticated, memberController.getAllMembers);
router.get('/:id', isAuthenticated, memberController.getMemberById);
router.post('/', isAuthenticated, memberController.createMember);
router.put('/:id', isAuthenticated, memberController.updateMember);
router.delete('/:id', isAuthenticated, memberController.deleteMember);
router.post('/:id/extend', isAuthenticated, memberController.extendMembership);
router.get('/:id/history', isAuthenticated, memberController.getMemberHistory);

export default router;
