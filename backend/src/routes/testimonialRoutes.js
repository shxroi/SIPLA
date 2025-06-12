// testimonialRoutes.js

import express from 'express';
import { 
    getAllTestimonials, 
    getTestimonialsByField,
    getAverageRatingByField,
    createTestimonial,
    getAllTestimonialsAdmin,
    updateTestimonialStatus,
    deleteTestimonial
} from '../controllers/testimonialController.js';
import { isAdminAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/public', getAllTestimonials);
router.get('/field/:lapanganId', getTestimonialsByField);
router.get('/field/:lapanganId/rating', getAverageRatingByField);
router.post('/', createTestimonial);

// Admin routes
router.get('/admin', isAdminAuthenticated, getAllTestimonialsAdmin);
router.patch('/admin/:id/status', isAdminAuthenticated, updateTestimonialStatus);
router.delete('/admin/:id', isAdminAuthenticated, deleteTestimonial);

export default router;
