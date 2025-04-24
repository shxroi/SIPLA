import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your-secret-key'; // Dalam produksi, gunakan environment variable

export const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: "Token tidak ditemukan" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token tidak valid" });
    }
}; 