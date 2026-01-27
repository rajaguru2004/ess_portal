const Minio = require('minio');

// MinIO client configuration
const minioClient = new Minio.Client({
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: 'admin',
    secretKey: 'StrongPassword@123',
});

const bucketName = 'attendance-photos';

/**
 * Script to manually set MinIO bucket policy for public read access
 */
async function setBucketPolicy() {
    try {
        console.log('🔧 Setting public read policy for MinIO bucket...');

        // Check if bucket exists
        const bucketExists = await minioClient.bucketExists(bucketName);
        if (!bucketExists) {
            console.log(`❌ Bucket '${bucketName}' does not exist. Creating...`);
            await minioClient.makeBucket(bucketName, 'us-east-1');
            console.log(`✅ Bucket '${bucketName}' created`);
        }

        // Set public read policy
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
        console.log(`✅ Public read policy successfully set for bucket '${bucketName}'`);

        console.log('\n📸 Photo URLs are now publicly accessible!');
        console.log('Example:');
        console.log(`http://localhost:9000/${bucketName}/attendance/user-id/2026-01-27/checkin-123456.jpg\n`);

    } catch (error) {
        console.error('❌ Error setting bucket policy:', error.message);
        process.exit(1);
    }
}

setBucketPolicy();
