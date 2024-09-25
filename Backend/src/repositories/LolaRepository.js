const Lola = require('../models/LolaModel');
const mongoose = require('mongoose');


const createLola = async (lolaData) => {
    const newLola = new Lola(lolaData);
    return await newLola.save();
};

const createLolaSession = async (sessionData) => {
    const newSession = new Lola(sessionData);
    return await newSession.save();
};

const decrementQuestionCount = async (lolaId) => {
    try {
        return await Lola.findOneAndUpdate(
            { lolaId },
            { $inc: { sessionQuestionCountRemaining: -1 }},
            { new: true }
        );
    } catch (error) {
        throw new Error(`Error decrementing question count: ${error.message}`);
    }
};




const updateSessionEnd = async (lolaId, sessionId, updatedFields) => {
  try {
    // const { lolaId, sessionId } = sessionData;
    updatedFields.isActive = false;

    const updatedSession = await Lola.findOneAndUpdate(
      { lolaId, sessionId, isActive:true },
      { $set: updatedFields},
      { new: true }
    );

    if (updatedSession) {
      console.log("User has been logged out successfully :)");
    } else {
      throw new Error("No active session found to update");
    }
    
    return updatedSession;
  } catch (error) {
    throw new Error(`Error updating Lola session ends: ${error.message}`);
  }
};

const findActiveSessionByUserId = async (userId) => {
    let userObjectId;
    try {
        userObjectId = new mongoose.Types.ObjectId(userId);
        const activeSession = await Lola.findOne({ userId: userObjectId, isActive: true });
        // console.log("userID : " + userId);
        // console.log("activeSession in LolaRepo: "  + activeSession);
        return activeSession; 
    } catch (error) {
        console.log("userId in activesession: ", userObjectId );
        throw new Error(`Error finding active sessionn: ${error.message} and ${userId}`);
    } finally {
        console.log("userId in activesession: ", userObjectId );
        
    }
    
};

const updateSessionWithQuestion = async (userId, message, lolaTextResponse) => {
    try {
         const updatedSession = await Lola.findOneAndUpdate(
            {  userId, sessionEnd: null },
            // sessionId,
            {
                $inc: {sessionQuestionCountRemaining: -1, interactionCount: +1},
                $push: { messagesToLola:message , messagesFromLola: lolaTextResponse}
            },
            {new: true}
        );

        if (!updatedSession) {
            throw new Error ('No active session found for user!! ');
        }

        return updatedSession;

    } catch (error) {
        throw new Error(`Error updating session with question: ${error.message}`);
    }
};

const getSessionDataByUserId = async (userId) => {
    try {
        const sessionData = await Lola.findOne({ userId }).sort({ sessionStart: -1});
        return sessionData; 
    } catch (error) {
        throw new Error(`Error fetching session data: ${error.message}`);
    }
};

const findLolaById = async (lolaId) => {
    return await Lola.findOne({ lolaId });
};

const updateLolaById = async (lolaId, updateData) => {
    return await Lola.findOneAndUpdate({ lolaId }, updateData, {new: true });
};

const deleteLolaById = async (lolaId) => {
    return await Lola.findOneAndDelete({ lolaId });
};

module.exports = {
  createLolaSession,
  findLolaById,
  updateLolaById,
  deleteLolaById,
  updateSessionEnd,
  findActiveSessionByUserId,
  updateSessionWithQuestion,
//   createLolaId,
createLola,
  decrementQuestionCount,
  getSessionDataByUserId,
};