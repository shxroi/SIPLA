import express from 'express';
import { login, logout } from '../controllers/adminController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/check-auth', isAuthenticated, (req, res) => {
  res.json({ valid: true });
});

export default router;