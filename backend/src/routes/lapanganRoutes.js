import express from 'express';
import { 
    getAllLapangan,
    getLapanganById,
    createLapangan,
    updateLapangan,
    deleteLapangan
} from '../controllers/lapanganController.js';
import { isAdminAuthenticated } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Public routes (tanpa autentikasi)
router.get('/public', getAllLapangan);
router.get('/public/:id', getLapanganById);

// Protected routes (memerlukan autentikasi)
router.get('/', isAdminAuthenticated, getAllLapangan);
router.get('/:id', isAdminAuthenticated, getLapanganById);
router.post('/', isAdminAuthenticated, upload.single('foto'), createLapangan);
router.put('/:id', isAdminAuthenticated, upload.single('foto'), updateLapangan);
router.delete('/:id', isAdminAuthenticated, deleteLapangan);

export default router;