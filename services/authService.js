const { OAuth2Client } = require('google-auth-library');
const userModel = require('../models/userModel');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const handleGoogleSignIn = async (token) => {
    const res = await fetch(process.env.GOOGLE_USER_INFO_URL, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await res.json();
    const googleId = data?.sub;

    let user = await userModel.findUserByGoogleId(googleId);
    if (!user) {
        user = await userModel.createUser({
            googleId,
            email: data?.email,
            name: data?.name,
            picture: data?.picture,
        });
    }

    return user;
};

module.exports = {
    handleGoogleSignIn,
};
