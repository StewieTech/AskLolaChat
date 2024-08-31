const Lola = require('../models/LolaModel');

const createLolaSession = async (lolaData) => {
    const lolaSession = new Lola(lolaData);
    return await lolaSession.save();
}

const findLolaById = async (lolaId) => {
    return await Lola.findOne({ lolaId });
};

const updateLolaById = async (lolaId, updateData) => {
    return await Lola.findOneAndUpdate({ lolaId }, updateData, {new: true });
};

const deleteLolaById = async (lolaId) => {
    return await Lola.findOneAndDelete({ lolaId });
};

module.exports = { createLolaSession, findLolaById, updateLolaById, deleteLolaById, } ;