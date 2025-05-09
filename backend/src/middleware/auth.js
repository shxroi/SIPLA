import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your-secret-key'; // Sebaiknya simpan di environment variable

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
            // Verifikasi token
            const decoded = jwt.verify(token, JWT_SECRET);
            req.admin = decoded; // Menggunakan req.admin bukan req.user untuk konsistensi
            next();
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