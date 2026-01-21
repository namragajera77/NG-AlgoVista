const express = require('express');
const adminmiddleware = require('../middleware/adminmiddleware');
const usermiddleware = require('../middleware/usermiddleware')
const {createProblem,updateproblem,deleteproblem,getproblembyid,getAllProblem,getAllProblemWithVideos,solvedallProblembyuser,submittedproblem} = require('../controllers/userProblem');


const problemRouter =  express.Router();



// create
// fetch
// update
// delete 


// need admin access
problemRouter.post("/create",adminmiddleware,createProblem);
problemRouter.put("/update/:id",adminmiddleware, updateproblem);
problemRouter.delete("/delete/:id",adminmiddleware,deleteproblem);



//no need of admin access
problemRouter.get("/problemSolvedByUser", usermiddleware,solvedallProblembyuser);
problemRouter.get("/problemById/:id",usermiddleware,getproblembyid);
problemRouter.get("/getAllProblem", usermiddleware,getAllProblem);

problemRouter.get("/testProblems", getAllProblem); // Test endpoint without admin middleware
problemRouter.get("/submittedProblem/:pid",usermiddleware,submittedproblem)



module.exports = problemRouter;