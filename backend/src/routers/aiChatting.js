const express = require('express');
const aiRouter =  express.Router();
const usermiddleware = require("../middleware/usermiddleware");
const solveDoubt = require('../controllers/solveDoubt');

aiRouter.post('/chat', usermiddleware, solveDoubt);

module.exports = aiRouter;