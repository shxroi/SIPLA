import dotenv from 'dotenv';
dotenv.config(); // Load environment variables first

import express from 'express';
import cors from 'cors';
import adminRoutes from './src/routes/adminRoutes.js';
import lapanganRoutes from './src/routes/lapanganRoutes.js';
import bookingRoutes from './src/routes/bookingRoutes.js';
import memberRoutes from './src/routes/memberRoutes.js';
import dashboardRoutes from './src/routes/dashboardRoutes.js';
import testimonialRoutes from './src/routes/testimonialRoutes.js';
import adminMemberRoutes from './src/routes/AdminMemberRoutes.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import session from 'express-session';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// CORS configuration
app.use(cors({
    origin: 'http://localhost:5173', // Frontend URL
    credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
    secret: 'your-secret-key', // Ganti dengan secret key yang aman
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set true jika menggunakan HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 jam
    }
}));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/lapangan', lapanganRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/member', memberRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/testimonial', testimonialRoutes);
app.use('/api/admin/member', adminMemberRoutes);

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
}); 