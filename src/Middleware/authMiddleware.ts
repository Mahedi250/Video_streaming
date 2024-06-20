import jwt, { Secret } from 'jsonwebtoken';
import { expressjwt } from 'express-jwt';

// Define the secret key (in a real application, store this securely)
const secretKey = process.env.APP_KEY as Secret;

// Middleware to verify JWT token
export const authenticateJWT = expressjwt({
    secret: secretKey,
    algorithms: ['HS256'],
}).unless({
    path: [
        // Public routes that don't require authentication
        '/api/login',
        '/api/signup',
    ],
});

// Function to generate a JWT token
export const generateToken = (user: { id: string; username: string }) => {
    return jwt.sign(user, secretKey, { expiresIn: '1h' });
};
