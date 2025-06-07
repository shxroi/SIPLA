import pool from '../config/database.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'admin_secret_key';

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const userResult = await pool.query(
            'SELECT * FROM admin WHERE username = $1 AND password = $2',
            [username, password]
        );

        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: "Username atau password salah" });
        }

        const user = userResult.rows[0];
        
        // Generate token
        const token = jwt.sign(
            { id: user.id, username: user.username, role: 'admin' },
            ADMIN_JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: "Login berhasil",
            user: {
                id: user.id,
                username: user.username,
                token: token
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
};

export const logout = (req, res) => {
    res.json({ message: "Logout berhasil" });
};