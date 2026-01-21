const express = require('express');
const usermiddleware = require('../middleware/usermiddleware')
const {usersubmission,runCode} = require('../controllers/usersubmission');

const submitrouter = express.Router();

submitrouter.post('/submit/:id',usermiddleware,usersubmission);
submitrouter.post("/run/:id",usermiddleware,runCode);

module.exports = submitrouter;
