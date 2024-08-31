const Message = require('../models/MessageModel');

const createMessage = async (messageData) => {
    const message = new Message(messageData);
    return await message.save();
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


module.exports = { createMessage,  findMessagesByUserId, deleteMessagesById };
