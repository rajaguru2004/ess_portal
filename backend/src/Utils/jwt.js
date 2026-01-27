const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

/**
 * JWT Utility Functions for RS256 Token Generation and Verification
 */

// Load RSA keys
const privateKeyPath = path.resolve(process.env.JWT_PRIVATE_KEY_PATH || './jwt-private.key');
const publicKeyPath = path.resolve(process.env.JWT_PUBLIC_KEY_PATH || './jwt-public.key');

let privateKey;
let publicKey;

try {
    privateKey = fs.readFileSync(privateKeyPath, 'utf8');
    publicKey = fs.readFileSync(publicKeyPath, 'utf8');
} catch (error) {
    console.error('❌ Failed to load JWT keys:', error.message);
    throw new Error('JWT keys not found. Please generate RSA key pair.');
}

const TOKEN_EXPIRY = process.env.JWT_ACCESS_TOKEN_EXPIRY || '1h';

/**
 * Generate JWT access token using RS256
 * @param {Object} payload - Token payload containing userId, roleId, tenantId
 * @returns {string} Signed JWT token
 */
const generateAccessToken = (payload) => {
    try {
        const token = jwt.sign(
            {
                ...payload
            },
            privateKey,
            {
                algorithm: 'RS256',
                expiresIn: TOKEN_EXPIRY,
                issuer: 'ess-portal',
                subject: payload.userId,
            }
        );
        return token;
    } catch (error) {
        console.error('❌ Error generating token:', error);
        throw new Error('Failed to generate access token');
    }
};

/**
 * Verify JWT token using RS256
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, publicKey, {
            algorithms: ['RS256'],
            issuer: 'ess-portal',
        });
        return decoded;
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new Error('Token expired');
        } else if (error.name === 'JsonWebTokenError') {
            throw new Error('Invalid token');
        } else {
            throw new Error('Token verification failed');
        }
    }
};

module.exports = {
    generateAccessToken,
    verifyToken,
};
