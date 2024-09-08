const User = require('../models/UserModel')

const createUser = async (userData) => {
    const user = new User(userData);
    return await user.save();
};

// const findUserById = async (userId)  => {
//     return await User.findOne({ emailId });
// };

const findUserByEmail = async (emailId) => {
    return await User.findOne({ emailId});
};

const updateUserById = async (userId, updateData) => {
    return await User.findOneAndUpdate({ userId }, updateData, { new: true }) ;
};

const deleteUserById = async (userId) => {
    return await User.findOneAndDelete({ userId });
};

const findUserById = async (userId) => {
    return await User.findById(userId);
}

module.exports = { createUser, findUserById, findUserByEmail, updateUserById, deleteUserById };