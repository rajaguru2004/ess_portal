const fs = require('fs');
const path = require('path');

/**
 * Quick Test Script for Attendance APIs
 * 
 * Usage:
 * 1. First, login to get a JWT token
 * 2. Replace TOKEN variable with the actual token
 * 3. Run: node test-attendance.js
 */

const BASE_URL = 'http://localhost:3000/api/v1';
const TOKEN = 'YOUR_JWT_TOKEN_HERE'; // Replace with actual token from login

// Test photo path (create a dummy image for testing)
const createTestImage = () => {
    // Create a simple test image buffer (1x1 pixel PNG)
    const buffer = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        'base64'
    );
    return buffer;
};

async function testCheckIn() {
    console.log('\n🔹 Testing Check-In...\n');

    const FormData = require('form-data');
    const form = new FormData();

    form.append('photo', createTestImage(), {
        filename: 'test-photo.png',
        contentType: 'image/png',
    });
    form.append('latitude', '12.9716');
    form.append('longitude', '77.5946');
    form.append('deviceInfo', 'Test Device');

    try {
        const response = await fetch(`${BASE_URL}/attendance/check-in`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                ...form.getHeaders(),
            },
            body: form,
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(data, null, 2));

        return data;
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function testCheckOut() {
    console.log('\n🔹 Testing Check-Out...\n');

    const FormData = require('form-data');
    const form = new FormData();

    form.append('latitude', '12.9716');
    form.append('longitude', '77.5946');
    form.append('deviceInfo', 'Test Device');

    try {
        const response = await fetch(`${BASE_URL}/attendance/check-out`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                ...form.getHeaders(),
            },
            body: form,
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(data, null, 2));

        return data;
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function main() {
    console.log('📋 Attendance API Test Suite');
    console.log('================================\n');

    if (TOKEN === 'YOUR_JWT_TOKEN_HERE') {
        console.log('❌ Please replace TOKEN variable with your actual JWT token');
        console.log('   Get token by calling POST /api/v1/auth/login first\n');
        return;
    }

    // Test Check-In
    await testCheckIn();

    // Wait a bit before check-out
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test Check-Out
    await testCheckOut();
}

// Run if executed directly
if (require.main === module) {
    main();
}

module.exports = { testCheckIn, testCheckOut };
