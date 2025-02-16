const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const cloudfront = new AWS.CloudFront();
const secretsManager = new AWS.SecretsManager();
const axios = require('axios');

exports.handler = async (event) => {
    const { name, comment, replyingTo, article, recaptchaToken } = JSON.parse(event.Records[0].body);
    const timestamp = new Date().toISOString();

    const responseHeaders = {
        "Access-Control-Allow-Origin": "*", // Adjust this to your domain for security
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST"
    };

    // Retrieve secrets from Secrets Manager
    let recaptchaSecret, distributionID;
    try {
        const secret = await secretsManager.getSecretValue({ SecretId: 'RecaptchaSecrets' }).promise();
        const secrets = JSON.parse(secret.SecretString);
        recaptchaSecret = secrets.recaptchaKey;
        distributionID = secrets.distributionID;
    } catch (error) {
        console.error('Error retrieving secret:', error);
        return {
            statusCode: 500,
            headers: responseHeaders,
            body: JSON.stringify({ error: 'Failed to retrieve secrets' })
        };
    }

    // Verify reCAPTCHA
    try {
        const recaptchaResponse = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
            params: {
                secret: recaptchaSecret,
                response: recaptchaToken
            }
        });

        if (!recaptchaResponse.data.success) {
            return {
                statusCode: 400,
                headers: responseHeaders,
                body: JSON.stringify({ error: 'CAPTCHA verification failed' })
            };
        }
    } catch (error) {
        console.error('Error verifying CAPTCHA:', error);
        return {
            statusCode: 500,
            headers: responseHeaders,
            body: JSON.stringify({ error: 'CAPTCHA verification failed' })
        };
    }

    const params = {
        Bucket: 'danielcherney.com',
        Key: 'comments.json'
    };

    try {
        const data = await s3.getObject(params).promise();
        const comments = JSON.parse(data.Body.toString());

        const newComment = {
            id: comments.length + 1,
            name,
            date: timestamp,
            comment,
            replyingTo: replyingTo || null,
            article
        };

        comments.push(newComment);

        await s3.putObject({
            Bucket: params.Bucket,
            Key: params.Key,
            Body: JSON.stringify(comments),
            ContentType: 'application/json'
        }).promise();

        // CloudFront invalidation
        const invalidationParams = {
            DistributionId: distributionID,
            InvalidationBatch: {
                CallerReference: `invalidate-${timestamp}`,
                Paths: {
                    Quantity: 1,
                    Items: ['/comments.json']
                }
            }
        };

        await cloudfront.createInvalidation(invalidationParams).promise();

        return {
            statusCode: 200,
            headers: responseHeaders,
            body: JSON.stringify(newComment)
        };
    } catch (error) {
        console.error('Error processing request:', error);
        return {
            statusCode: 500,
            headers: responseHeaders,
            body: JSON.stringify({ error: 'Could not update comments.' })
        };
    }
};
