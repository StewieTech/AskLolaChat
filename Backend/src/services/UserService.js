const userRepository = require('../repositories/UserRepository')
const lolaSerivce = require('../services/LolaService');
const bcrypt = require('bcrypt');


/**
 * Registers a new user.
 * 
 * @param {Object} userData - The data of the user to be registered.
 * @returns {Object} - The created user object.
 * @throws {Error} - Throws an error if the email is already registered.
 */
const registerUser = async (userData) => {
    const existingUser = await userRepository.findUserByEmail(userData.emailId);

    if (existingUser) {
        throw new Error('User with this email already exists');
    }

    // Hash the user's password before saving it
    const hashedPassword = await bcrypt.hash(userData.password, 10); // 10 is the salt rounds
    const userToSave = { ...userData, password: hashedPassword };

    return await userRepository.createUser(userToSave);
};



const authenticateUser = async (emailId, password) => {
    const user = await userRepository.findUserByEmail(emailId);

    if (!user) {
        throw new Error('User not found');
    }
    const isMatch = await bcrypt.compare(password, user.password); 

    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    const lolaSession = await lolaSerivce.createLolaSession(user._id);


    return { user, lolaSession};
};

const logoutUser = async (userId) => {
    const user = await userRepository.findUserById(userId);

    if (!user) {
        throw new Error('User not found');
    }

    await lolaSerivce.endLolaSession(userId);

    return {success: true, message: 'User Logged out successfully'};
}


/**
 * @param {Object} updateData
 */

const updateUserDetails = async (userId, updateData) => {
    return await userRepository.updateUserById(userId, updateData);
};

/**
 * 
 * @param userId 
 * @returns {Object}
 */

const deleteUserAccount = async (userId) => {
    return await userRepository.deleteUserById(userId);
};

const findUserById = async (userId) => {
    return await userRepository.findUserById(userId);
};

const updateUserProfile = async (userId, profileData) =>  {
    const existingUser = await userRepository.findUserById(userId);

    if (!existingUser) {
        throw new Error('User not found');
    }

    const updatedUser = await userRepository.updateUserById(userId, profileData);

    return updatedUser; 
}



module.exports = {
    registerUser,
    authenticateUser,
    updateUserDetails,
    deleteUserAccount,
    findUserById,
    updateUserProfile,
    logoutUser,
};