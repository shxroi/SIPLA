import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'admin_secret_key';

export const isAuthenticated = (req, res, next) => {
    try {
        // Get token dari header
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Token tidak ditemukan" });
        }

        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Format token tidak valid" });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "Token tidak valid" });
        }

        try {
            let decoded;
            // Try to verify as member token first
            try {
                decoded = jwt.verify(token, JWT_SECRET);
                if (decoded.role === 'member') {
                    req.user = decoded;
                    return next();
                }
            } catch (memberError) {
                // If member token verification fails, try admin token
                try {
                    decoded = jwt.verify(token, ADMIN_JWT_SECRET);
                    req.admin = decoded;
                    return next();
                } catch (adminError) {
                    throw memberError; // If both fail, throw the original error
                }
            }
        } catch (jwtError) {
            console.error('JWT Verification Error:', jwtError);
            if (jwtError.name === 'TokenExpiredError') {
                return res.status(401).json({ message: "Token telah kadaluarsa" });
            }
            return res.status(401).json({ message: "Token tidak valid", error: jwtError.message });
        }
    } catch (error) {
        console.error('Auth error:', error);
        return res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
};