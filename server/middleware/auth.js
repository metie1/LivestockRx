const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Received token:', token); // 디버깅용

    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        console.log('Decoded token:', decoded); // 디코딩된 토큰 로깅

        next();
    } 
    catch (err) {
        console.log('Invalid token:', err.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};