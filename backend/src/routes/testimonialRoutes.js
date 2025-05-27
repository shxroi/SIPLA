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
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/public', getAllTestimonials);
router.get('/field/:lapanganId', getTestimonialsByField);
router.get('/field/:lapanganId/rating', getAverageRatingByField);
router.post('/', createTestimonial);

// Admin routes
router.get('/admin', isAuthenticated, getAllTestimonialsAdmin);
router.patch('/admin/:id/status', isAuthenticated, updateTestimonialStatus);
router.delete('/admin/:id', isAuthenticated, deleteTestimonial);

export default router;
