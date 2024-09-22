
const lolaRepository = require('../repositories/LolaRepository');
const userRepository = require('../repositories/UserRepository');
const messageRepository = require('../repositories/MessageRepository');

/**
 * Starts a new Lola session.
 * This function creates a new session when a user starts interacting with Lola.
 * 
 */

// const createLolaSession = async (userId) => {
//     const sessionStart = new Date();
//     return await lolaRepository.createLolaSession(userId, sessionStart);
// };

// const createLolaSession = async (userId, sessionStart) => {
//     try {
//         const session = await lolaRepository.createLolaSession(userId, sessionStart);
//         return session;
//     } catch (error) {
//         throw new Error(`Error fetching Lola session: ${error.message}`);
//     }
// };

const createLolaSession = async (userId,  sessionStart) => {
    try {
        const existingLola = await userRepository.findUserById(userId);
        // const { userId } = existingLola ;
        // console.log("userId in createLolaSession: ", userId);

        if (!userId) {
            const newLola = {
                userId,
                sessionStart,
                maxQuestionLimit: 3,
                sessionQuestionCountRemaining: 3,
                relationshipLevel: 1,
            };
            return await lolaRepository.createLola(newLola);
        } else {
            console.log("userId in createLolaSession error: ", userId);
            console.log("this is existing" , existingLola.userId);
            const newSession = { 
                userId: existingLola.userId,
                lolaId: existingLola.lolaId,
                sessionStart,
                maxQuestionLimit: existingLola.maxQuestionLimit,
                sessionQuestionCountRemaining: existingLola.sessionQuestionCountRemaining,
                relationshipLevel: existingLola.relationshipLevel,
            }
            return await lolaRepository.createLolaSession(newSession);
        }
    } catch (error) {
        throw new Error(`Error creating Lola session: ${error.message} and ${userId}`);
    }
};

// const createLolaId = async (userId) => {
//     try {
//         const lola = await lolaRepository.createLolaId(userId);
//         return lola;
//     } catch (error) {
//         throw new Error(`Error fetching Lola Id: ${error.message}`);
//     }
// };

// // could handle error of there being no userId
// const endLolaSession = async (userId) => {
//     try {
//         if (!userId) {
//             throw new Error('userId is not defined');
//         }
//         const sessionEnd = new Date();
//         return await lolaRepository.updateSessionEnd(userId, sessionEnd);
//     } catch (error) {
//         console.log('userId in LolaService: ', userId)
//         throw new Error(`Error updating Lola session endss: ${error.message}`);
//     }
//     };

const endLolaSession = async (id) => {
    try {
        const existingLola = await userRepository.findUserById(id)
        const { userId } = existingLola;
        const activeSession = await lolaRepository.findActiveSessionByUserId(userId);

        if (!activeSession) {
            throw new Error('No active session found for user');
        }

        const totalQuestionsAsked = await messageRepository.countQuestionsForSession(activeSession.lolaId, activeSession.sessionId); // haven;t implemented yet
    
        activeSession.sessionQuestionCountRemaining -= totalQuestionsAsked ;
        activeSession.sessionEnd = new Date();
        
        return await lolaRepository.updateSessionEnd(activeSession);
    } catch (error) {
        throw new Error(`Error ending Lola session: ${error.message}`);
    }
}
    
const handleQuestion = async (userId, message) => {
    try {
        const activeSesison = await lolaRepository.findActiveSessionByUserId(userId);

        if (!activeSesison) {
            throw new Error('No active session found');
        }

        const updateSession = await lolaRepository.updateSessionWithQuestion(activeSesison._id, message);

        return updateSession;
    } catch (error) {
        throw new Error(`Error handling question: ${error.message}`);
    }
};

const getQuestionCount = async (userId) => {
    try {
        const sessionData = await lolaRepository.getSessionDataByUserId(userId);
        return {
            sessionQuestionCountRemaining: sessionData.sessionQuestionCountRemaining,
            maxQuestionLimit: sessionData.maxQuestionLimit,
        };
    } catch (error) {
        throw new Error(`Error fetching question count: ${error.message}`);
    }
};

/**
 * 
 * @param {String} lolaId 
 * @param {Number} incrementBy 
 * @returns 
 */
const updateRelationshipLevel = async (lolaId, incrementBy = 1) => {
    const lolaSession = await lolaRepository.findLolaById(lolaId);
    if (!lolaSession) {
        throw new Error('Lola session not found');
    }

    lolaSession.relationshipLevel += incrementBy;
    return await lolaRepository.updateLolaById(lolaId, lolaSession);
};

/**
 * 
 * @param {String} lolaId - The ID of the Lola session to be ended.
 * @returns - The updated Lola session object with the end time set.
 * @throws {Error} - Throws an error if the Lola session is not found or if the update fails.
 */

// const endLolaSession = async (lolaId) => {
//     const lolaSession = await lolaRepository.findLolaById(lolaId);

//     if (!lolaSession) {
//         throw new Error('Lola session not found');
//     }

//     lolaSession.sessionEnd = new Date();
//     return await lolaRepository.updateLolaById(lolaId.lolaSession);
        
// };

/**
 * 
 * @param {String} lolaId 
 * @returns 
 */

const getLolaSessionById = async (lolaId) => {
    return await lolaRepository.findLolaById(lolaId);
};

module.exports = {
    updateRelationshipLevel, endLolaSession, getLolaSessionById,
    createLolaSession,
    endLolaSession,
    handleQuestion,
    getQuestionCount,
};