import express from 'express';
import dashboardController from '../controllers/dashboardController.js';
import { isAdminAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Routes (memerlukan autentikasi admin)
router.get('/stats', isAdminAuthenticated, dashboardController.getDashboardStats);

export default router;
