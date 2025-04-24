import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

const JWT_SECRET = 'your-secret-key'; // Dalam produksi, gunakan environment variable

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Cek apakah username ada
        const userResult = await pool.query(
            'SELECT * FROM admin WHERE username = $1',
            [username]
        );

        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: "Username atau password salah" });
        }

        const user = userResult.rows[0];

        // Verifikasi password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Username atau password salah" });
        }

        // Generate token
        const token = jwt.sign(
            { id: user.id, username: user.username },
            JWT_SECRET,
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
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
}; 