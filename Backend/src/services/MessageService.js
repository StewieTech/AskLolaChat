// src/services/messageService.js
require('dotenv').config();
const OpenAI = require('openai');
const {Configuration, OpenAIApi} = OpenAI;
// const axios = require('axios');
const secrets = require('../../../secrets')
const messageRepository = require('../repositories/messageRepository'); // Importing the message repository
const { sendTextToLola } = require('../controllers/messageController');

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
const receiveTextFromLola = async (messageData) => {
    // const lolaTextResponse = await createLolaTextResponse(messageData.content);
    // const newMessageData = { ...messageData, content: lolaTextResponse};
    return await messageRepository.createMessage(messageData);
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
        "max_tokens": 80,
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
