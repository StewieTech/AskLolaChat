// src/services/messageService.js
require('dotenv').config();
const OpenAI = require('openai');
const {Configuration, OpenAIApi} = OpenAI;
// const axios = require('axios');
const secrets = require('../../../secrets')
const messageRepository = require('../repositories/messageRepository'); // Importing the message repository
const LolaRepository = require('../repositories/LolaRepository')
const UserRepository = require('../repositories/UserRepository');

const contentAnswer = secrets.contentAnswer;

/**
 * Sends a message to Lola.
 * This function stores a message sent to Lola, typically from a user.
 * 
 * @param {Object} messageData - The data of the message to be created.
 * @returns {Object} - The created message object.
 * @throws {Error} - Throws an error if there is an issue during message creation.
 */
const sendMessageToLola = async (messageData) => {
    return await messageRepository.createMessage(messageData);
};

// const saveLolaMessage = async (messageData) =>{
//     return await messageRepository.createMessage(messageData);
// }

/**
 * Sends a message from Lola.
 * This function stores a message sent by Lola to the user.
 * 
 * @param {Object} messageData - The data of the message to be created.
 * @returns {Object} - The created message object.
 * @throws {Error} - Throws an error if there is an issue during message creation.
 */

// const receiveTextFromLola = async (messageData) => {
//     return await messageRepository.createMessage(messageData);
// };

const receiveTextFromLola = async (message, userId) => {
  try {
    const user = await messageRepository.getUserById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const lolaTextResponse = await createLolaTextResponse(message);

    const lolaMessageData = {
      userId: user.userId,
      emailId: user.emailId,
      question: message,
      lolaResponse: lolaTextResponse,
    };

    await messageRepository.createMessage(lolaMessageData);
    // await MessageModel.create(lolaMessageData);


    return lolaTextResponse;
  } catch (error) {
    console.error("Error receiving message: ", error);
    throw error;
  }
};

/**
 * Fetches all messages exchanged in a specific Lola session.
 * This function retrieves all messages related to a given Lola session.
 * 
 * @param {String} lolaId - The ID of the Lola session to fetch messages for.
 * @returns {Array} - An array of message objects related to the Lola session.
 * @throws {Error} - Throws an error if there is an issue during retrieval.
 */
const getMessagesByLolaSession = async (lolaId) => {
    return await messageRepository.findMessagesByLolaId(lolaId);
};

/**
 * Fetches all messages sent by a specific user.
 * This function retrieves all messages sent by a particular user.
 * 
 * @param {String} userId - The ID of the user to fetch messages for.
 * @returns {Array} - An array of message objects related to the user.
 * @throws {Error} - Throws an error if there is an issue during retrieval.
 */
const getMessagesByUser = async (userId) => {
    return await messageRepository.findMessagesByUserId(userId);
};

/**
 * Deletes a specific message by its ID.
 * This function removes a message from the database by its unique ID.
 * 
 * @param {String} messageId - The ID of the message to be deleted.
 * @returns {Object} - The deleted message object.
 * @throws {Error} - Throws an error if the message is not found or if the deletion fails.
 */
const deleteMessage = async (messageId) => {
    return await messageRepository.deleteMessageById(messageId);
};

const handleUserMessage = async (userId, message) => {
    try { 
        const user = await UserRepository.findUserById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        let lolaSession = await LolaRepository.findLolaById({ userId }); // why use {} ? 
        if (!lolaSession) {
            let initialQuestionCount;
            switch (user.subsciptionType) {
                case 'Premium':
                    initialQuestionCount = 10;
                    break;
                case 'Develop':
                    initialQuestionCount = 99;
                    break;
                case 'Free':
                    initialQuestionCount = 1;
                    break;
                default:
                    initialQuestionCount = 1;
                    break;
            }
            lolaSession = new LolaRepository.createLolaSession({ userId, questionCount: initialQuestionCount});
        }

        if (lolaSession.questionCount > 0) {
            lolaSession.questionCount -= 1;
        } else {
            throw new Error('No more questions. Upgrade to continue.');
        }

        await lolaSession.save();

        return lolaSession;
    } catch (error) {
        console.error('No UserMessage I guess: ', error);
        throw new Error(error.message); // are both of these lines necessary ?
    }
}

const createLolaTextResponse = async (inputText) => {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    // console.log("OpenAI API Key:", process.env.OPENAI_API_KEY);


    const openai = new OpenAIApi(configuration);

    const response = await openai.createChatCompletion({
        "model": "gpt-3.5-turbo",
        // "model": "gpt-4",
        messages: [
            {role: "system", content: contentAnswer},
            {role: "user", content: inputText},
        ],
        "max_tokens": 40,
        "temperature": 0
    });
    
    // console.log(response.data)
    
    var answer = response["data"]["choices"][0]["message"]["content"]
    console.log(answer);
    return answer;


    };


module.exports = {
    sendMessageToLola,
    receiveTextFromLola,
    getMessagesByLolaSession,
    getMessagesByUser,
    deleteMessage,
    createLolaTextResponse,
};
