const prisma = require('../config/prisma');

const findUserByGoogleId = async (googleId) => {
    return await prisma.user.findUnique({
        where: { googleId },
    });
};

const createUser = async (user) => {
    return await prisma.user.create({
        data: user,
    });
};

module.exports = {
    findUserByGoogleId,
    createUser,
};
