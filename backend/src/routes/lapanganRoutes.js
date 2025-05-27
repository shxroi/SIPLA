import express from 'express';
import { 
    getAllLapangan,
    getLapanganById,
    createLapangan,
    updateLapangan,
    deleteLapangan
} from '../controllers/lapanganController.js';
import { isAuthenticated } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Public routes (tanpa autentikasi)
router.get('/public', getAllLapangan);
router.get('/public/:id', getLapanganById);

// Protected routes (memerlukan autentikasi)
router.get('/', isAuthenticated, getAllLapangan);
router.get('/:id', isAuthenticated, getLapanganById);
router.post('/', isAuthenticated, upload.single('foto'), createLapangan);
router.put('/:id', isAuthenticated, upload.single('foto'), updateLapangan);
router.delete('/:id', isAuthenticated, deleteLapangan);

export default router;