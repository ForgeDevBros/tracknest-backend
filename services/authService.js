const { OAuth2Client } = require('google-auth-library');
const userModel = require('../models/userModel');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const handleGoogleSignIn = async (token) => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const googleId = payload.sub;

    let user = await userModel.findUserByGoogleId(googleId);
    if (!user) {
        user = await userModel.createUser({
            googleId,
            email: payload.email,
            name: payload.name,
            picture: payload.picture,
        });
    }

    return user;
};

module.exports = {
    handleGoogleSignIn,
};
