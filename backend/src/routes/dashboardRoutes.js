import express from 'express';
import dashboardController from '../controllers/dashboardController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Routes (memerlukan autentikasi admin)
router.get('/stats', isAuthenticated, dashboardController.getDashboardStats);

export default router;
