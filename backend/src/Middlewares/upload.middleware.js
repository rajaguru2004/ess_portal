const multer = require('multer');
const { Client } = require('minio');

/**
 * MinIO Client Configuration
 * S3-compatible object storage for attendance photos
 */

let minioClient;

/**
 * Get or create MinIO client instance (Singleton)
 * @returns {Client} MinIO client
 */
const getMinioClient = () => {
    if (!minioClient) {
        minioClient = new Client({
            endPoint: process.env.MINIO_ENDPOINT || 'localhost',
            port: parseInt(process.env.MINIO_PORT) || 9000,
            useSSL: process.env.MINIO_USE_SSL === 'true',
            accessKey: process.env.MINIO_ACCESS_KEY,
            secretKey: process.env.MINIO_SECRET_KEY,
        });

        console.log('✅ MinIO client initialized');
    }
    return minioClient;
};

/**
 * Ensure bucket exists, create if not
 */
const ensureBucket = async () => {
    const client = getMinioClient();
    const bucketName = process.env.MINIO_BUCKET || 'attendance-photos';

    try {
        const bucketExists = await minioClient.bucketExists(bucketName);
        if (!bucketExists) {
            await minioClient.makeBucket(bucketName, 'us-east-1');
            console.log(`✅ MinIO bucket '${bucketName}' created successfully`);

            // Set bucket policy to allow public read access
            const policy = {
                Version: '2012-10-17',
                Statement: [
                    {
                        Effect: 'Allow',
                        Principal: { AWS: ['*'] },
                        Action: ['s3:GetObject'],
                        Resource: [`arn:aws:s3:::${bucketName}/*`],
                    },
                ],
            };

            await minioClient.setBucketPolicy(bucketName, JSON.stringify(policy));
            console.log(`✅ Public read policy set for bucket '${bucketName}'`);
        }
        console.log(`✅ MinIO connected to bucket: ${bucketName}`);
    } catch (error) {
        console.error('❌ MinIO initialization error:', error.message);
    }
};

// Initialize bucket on module load
ensureBucket();

/**
 * Upload file buffer to MinIO
 * @param {Buffer} fileBuffer - File buffer from Multer
 * @param {string} fileName - Unique filename
 * @param {string} mimeType - File MIME type
 * @returns {Promise<string>} Public URL of uploaded file
 */
const uploadToMinio = async (fileBuffer, fileName, mimeType) => {
    const client = getMinioClient();
    const bucketName = process.env.MINIO_BUCKET || 'attendance-photos';

    try {
        await client.putObject(bucketName, fileName, fileBuffer, fileBuffer.length, {
            'Content-Type': mimeType,
        });

        // Generate public URL (assuming MinIO is accessible via configured endpoint)
        const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
        const endpoint = process.env.MINIO_ENDPOINT || 'localhost';
        const port = process.env.MINIO_PORT || 9000;
        const url = `${protocol}://${endpoint}:${port}/${bucketName}/${fileName}`;

        return url;
    } catch (error) {
        console.error('❌ MinIO upload failed:', error);
        throw new Error('File upload failed');
    }
};

/**
 * Multer configuration for memory storage
 */
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    // Accept only images
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
    },
});

/**
 * Middleware for single photo upload
 */
const uploadPhoto = upload.single('photo');

module.exports = {
    uploadPhoto,
    uploadToMinio,
    getMinioClient,
};
