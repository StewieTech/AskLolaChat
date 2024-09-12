// src/routes/lolaRoutes.js

const express = require('express');
const lolaController = require('../controllers/lolaController');

const router = express.Router();

router.get('/question-count', lolaController.getQuestionCount);

// Route to start a new Lola session
router.post('/start', lolaController.startLolaSession);

router.post('/message', lolaController.handleQuestionSubmit);

// Route to update the relationship level
router.put('/relationship/:lolaId', lolaController.updateRelationshipLevel);

// Route to end a Lola session
router.put('/end/:lolaId', lolaController.endLolaSession);

// Route to fetch a Lola session by ID
router.get('/:lolaId', lolaController.getLolaSessionById);

module.exports = router;
