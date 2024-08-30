// auth/oauth.js
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const verifyGoogleToken = async (tokenId) => {
    try {
        const response = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { email_verified, name, email } = response.payload;

        if (email_verified) {
            return { name, email };
        } else {
            throw new Error('Email not verified');
        }
    } catch (error) {
        throw new Error('Google token verification failed');
    }
};

module.exports = {
    verifyGoogleToken,
};
