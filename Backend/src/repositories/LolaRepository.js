const Lola = require('../models/LolaModel');


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




const updateSessionEnd = async (sessionData) => {
    try {
        const { lolaId, sessionId } = sessionData;
        return await Lola.findOneAndUpdate(
            { lolaId, sessionId, session: null },
            { sessionEnd: sessionData.sessionEnd },
            { new: true },
            console.log("User has been logged out successfully :)")
        )
    } catch (error) {
        throw new Error(`Error updating Lola session ends: ${error.message}`)
    }
};

const findActiveSessionByUserId = async (userId) => {
    try {
        return await Lola.findOne({ userId, sessionEnd: null});
    } catch (error) {
        throw new Error(`Error finding active session: ${error.message}`);
    }
};

const updateSessionWithQuestion = async (sessionId, message) => {
    try {
        return await Lola.findByIdAndUpdate(
            sessionId,
            {
                $inc: {questionCount: 1},
                $push: { messagesToLola:message }
            },
            {new: true}
        );
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