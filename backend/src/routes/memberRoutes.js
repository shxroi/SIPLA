// memberRoutes.js

import express from 'express';
import memberController from '../controllers/memberController.js';
import auth from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public endpoints
router.post('/register', upload.single('foto_ktp'), memberController.registerMember);

// Admin endpoints
router.get('/admin', auth.verifyToken, memberController.getAllMembers);
router.get('/admin/:id', auth.verifyToken, memberController.getMemberById);
router.put('/admin/:id', auth.verifyToken, upload.single('foto_ktp'), memberController.updateMember);
router.put('/admin/:id/extend', auth.verifyToken, memberController.extendMembership);
router.put('/admin/:id/status', auth.verifyToken, memberController.updateMemberStatus);
router.delete('/admin/:id', auth.verifyToken, memberController.deleteMember);

export default router;