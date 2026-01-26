const crypto = require('crypto');
const fs = require('fs');

// Generate RSA key pair for RS256 JWT
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
    }
});

// Save keys to files
fs.writeFileSync('jwt-private.key', privateKey);
fs.writeFileSync('jwt-public.key', publicKey);

console.log('✅ RSA key pair generated successfully!');
console.log('📁 Private key saved to: jwt-private.key');
console.log('📁 Public key saved to: jwt-public.key');
console.log('\n📝 Add these to your .env file:');
console.log('\nJWT_PRIVATE_KEY_PATH=./jwt-private.key');
console.log('JWT_PUBLIC_KEY_PATH=./jwt-public.key');
