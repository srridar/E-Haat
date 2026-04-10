import jwt from 'jsonwebtoken';

const isAuthenticated = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided', success: false });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token', success: false });
        }
        req.user = decoded;
        next();                  
        
    }catch (error) {
        console.error('Authentication error:', error);
    }
}

export default isAuthenticated;