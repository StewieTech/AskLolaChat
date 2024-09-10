const Message = require('../models/MessageModel');
const UserModel = require('../models/UserModel')

const createMessage = async (messageData) => {
    try {
        const message = new Message(messageData);
        return await message.save();
    } catch (error) {
        console.error('Error saving message: ', error);
        throw error
    }
};

const getUserById = async (userId) => {
    try {
        const user = await UserModel.findById(userId).select('emailId _id');
        return user;
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        throw new Error('Failed to fetch user');
    }
};

// const findMessageByLolaId = async (lolaId) => {
//     return await Message.find({ lolaId });
// };

const findMessagesByUserId = async (userId) => {
    return await Message.find({ userId })
};

const deleteMessagesById =  async (messageId) => {
    return await Message.findByIdAndDelete(messageId);
};


module.exports = { createMessage,
      findMessagesByUserId,
       deleteMessagesById,
       getUserById,
     };
