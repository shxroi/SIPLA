const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3001;

// Database connection
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'sipla_db',
    password: 'postgres', // Sesuaikan dengan password PostgreSQL Anda
    port: 5432,
});

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.send('Welcome to SIPLA API!');
});

// Admin login route
app.post('/api/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Login attempt:', { username, password });

        // Cek apakah username ada
        const userResult = await pool.query(
            'SELECT * FROM admin WHERE username = $1',
            [username]
        );

        console.log('Database result:', userResult.rows);

        if (userResult.rows.length === 0) {
            console.log('User not found');
            return res.status(401).json({ message: "Username atau password salah" });
        }

        const user = userResult.rows[0];
        console.log('Found user:', { 
            id: user.id, 
            username: user.username,
            storedPassword: user.password 
        });

        // Simple password comparison
        if (password !== user.password) {
            console.log('Password mismatch');
            return res.status(401).json({ message: "Username atau password salah" });
        }

        console.log('Login successful');

        // Generate token
        const token = jwt.sign(
            { id: user.id, username: user.username },
            'your-secret-key',
            { expiresIn: '1h' }
        );

        res.json({
            message: "Login berhasil",
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
}); 