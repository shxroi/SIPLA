import express from 'express';
import { login, logout } from '../controllers/adminController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);

export default router; 