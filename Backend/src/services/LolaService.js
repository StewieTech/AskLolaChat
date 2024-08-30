
const lolaRepository = require('../repositories/LolaRepository');

/**
 * Starts a new Lola session.
 * This function creates a new session when a user starts interacting with Lola.
 * 
 * @param {Object} lolaData - The data for the new session.
 * @returns {Object} - The created Lola session object.
 * @throws {Error} - Throws an error if there is an issue during session creation.
 */
const startLolaSession = async (lolaData) => {
    return await lolaRepository.createLolaSession(lolaData);
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

const endLolaSession = async (lolaId) => {
    const lolaSession = await lolaRepository.findLolaById(lolaId);

    if (!lolaSession) {
        throw new Error('Lola session not found');
    }

    lolaSession.sessionEnd = new Date();
    return await lolaRepository.updateLolaById(lolaId.lolaSession);
        
};

/**
 * 
 * @param {String} lolaId 
 * @returns 
 */

const getLolaSessionById = async (lolaId) => {
    return await lolaRepository.findLolaById(lolaId);
};

module.exports = {
    startLolaSession, updateRelationshipLevel, endLolaSession, getLolaSessionById,
};