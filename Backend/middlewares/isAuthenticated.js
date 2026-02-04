import jwt from 'jsonwebtoken';

const isAuthenticated = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided', success: false });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // it returns the payload if token is valid else returns null. payload contains  the user info like id, email etc.
        if (!decoded) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token', success: false });
        }
        req.user = decoded;
        next();                    // Attach user info to request object . it helps to access user info in next middlewares or route handlers.
        
    }catch (error) {
        console.error('Authentication error:', error);
    }
}

export default isAuthenticated;