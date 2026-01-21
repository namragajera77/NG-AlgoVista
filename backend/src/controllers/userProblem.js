const {getLanguageById,submitBatch,submitToken} = require("../utils/problemUtility");

const Problem = require('../models/problem');
const submissions = require('../models/submission')
const User = require('../models/user')
const SolutionVideo = require("../models/solutionVideo")


const createProblem = async (req,res)=>{

    const {title,description,difficulty,tags,
        visibleTestCases,hiddenTestCases,startCode,
        referenceSolution, problemCreator
    } = req.body;

    // console.log(req.body)


    try{
       
      for(const {language,completeCode} of referenceSolution){
         

        // source_code:
        // language_id:
        // stdin: 
        // expectedOutput:

        const languageId = getLanguageById(language);
          
        // I am creating Batch submission
        const submissions = visibleTestCases.map((testcase)=>({
            source_code:completeCode,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }));


        const submitResult = await submitBatch(submissions);
       

        const resultToken = submitResult.map((value)=> value.token);

        // ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1","1b35ec3b-5776-48ef-b646-d5522bdeb2cc"]
        
       const testResult = await submitToken(resultToken);



       for(const test of testResult){
        if(test.status_id!=3){
         return res.status(400).send("Error Occured");
        }
       }

      }


      // We can store it in our DB

    const userProblem =  await Problem.create({
        ...req.body,
        problemCreator: req.result._id
      });

      res.status(201).send("Problem Saved Successfully");
    }
    catch(err){
        res.status(400).send("Error: "+err);
    }
}

const updateproblem = async (req,res)=>{
    try{

            const {id} = req.params
            const {title,description,difficulty,tags,
            visibleTestCases,hiddenTestCases,startCode,
            referenceSolution, problemCreator }= req.body;

            console.log(req.body);

            if(!id){
                return res.status(400).send("invalid id field")
            }

            const dsaproblem = await Problem.findById(id)

            if(!dsaproblem){
                return res.status(404).send("problem not found")
            }


        for(const {language,completeCode} of referenceSolution){



        const languageId = getLanguageById(language);
          
        // I am creating Batch submission
        const batchSubmissions = visibleTestCases.map((testcase)=>({
            source_code:completeCode,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }));


        const submitResult = await submitBatch(batchSubmissions);

        // console.log(submitResult);

        const resulttoken = submitResult.map((result)=>result.token);

        const testresult = await submitToken(resulttoken);

        // console.log(testresult);

        for(const test of testresult){
if (test.status_id === 1) {
    return res.status(400).send("In Queue");
}
if (test.status_id === 2) {
    return res.status(400).send("Processing");
}
if (test.status_id === 4) {
    return res.status(400).send("Wrong Answer");
}
if (test.status_id === 5) {
    return res.status(400).send("Time Limit Exceeded");
}
if (test.status_id === 6) {
    return res.status(400).send("Compilation Error");
}
if (test.status_id === 7) {
    return res.status(400).send("Runtime Error (SIGSEGV)");
}
if (test.status_id === 8) {
    return res.status(400).send("Runtime Error (SIGXFSZ)");
}
if (test.status_id === 9) {
    return res.status(400).send("Runtime Error (SIGFPE)");
}
if (test.status_id === 10) {
    return res.status(400).send("Runtime Error (SIGABRT)");
}
if (test.status_id === 11) {
    return res.status(400).send("Runtime Error (NZEC)");
}
if (test.status_id === 12) {
    return res.status(400).send("Runtime Error (Other)");
}
if (test.status_id === 13) {
    return res.status(400).send("Internal Error");
}
if (test.status_id === 14) {
    return res.status(400).send("Exec Format Error");
}

        }
    }
        const newproblem = await Problem.findByIdAndUpdate(id,{...req.body, problemCreator: req.result._id},{runValidators:true,new:true})
        res.status(200).send("problem updated successfully");
    }

    catch(err){
      res.status(400).send("error: " + err); 
    }
}

const deleteproblem = async (req,res)=>{

   try{
   const {id} = req.params

   if(!id){
    res.status(400).send("id field  is missing");
   }

   const deleteid = await Problem.findByIdAndDelete(id);

   if (!deleteid) {
  return res.status(404).send("problem is missing");
}
res.status(200).send("problem deleted succesfully");
}
catch(err){
    res.status(400).send("error"+err)
}

}

const getproblembyid = async (req,res)=>{

    try{
    const {id} = req.params

    if(!id){
        return res.status(400).send("id field is missing")
    }

    const getProblem = await Problem.findById(id).select('_id title description difficulty tags visibleTestCases hiddenTestCases startCode referenceSolution ');
       
        // video ka jo bhi url wagera le aao
    
       if(!getProblem)
        return res.status(404).send("Problem is Missing");
    
       const videos = await SolutionVideo.findOne({problemId:id});
       if(videos){   
    
       const responseData = {
       ...getProblem.toObject(),
       secureUrl:videos.secureUrl,
       thumbnailUrl : videos.thumbnailUrl,
       duration : videos.duration,
   } 
  
       return res.status(200).send(responseData);

       }
        
       res.status(200).send(getProblem);

       console.log(getProblem);
}
catch(err){
    res.status(400).send("error : "+err);
}
}

const getAllProblem = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; 
        const limit = 10;
        const skip = (page - 1) * limit;

        const result = await Problem.find({}).select('title description difficulty tags')
            .skip(skip)
            .limit(limit);

        if (result.length === 0) {
            return res.status(400).send("No problems found on this page.");
        }

        res.status(200).json(result);
    } catch (err) {
        res.status(400).send("Error: " + err);
    }
};



const solvedallProblembyuser = async (req, res) => {
  try {
        const userId = req.result._id;
   
         const user =  await User.findById(userId).populate({
           path:"problemSolved",
           select:"_id title difficulty tags"
         });
         
         res.status(200).send(user.problemSolved);
        }
  catch (err) {
    res.status(500).send("Server Error: " + err.message);
  }
};

const submittedproblem = async (req,res) => {
    try{
        const userid = req.result._id;
        const problemid = req.params.pid;

        const answer = await submissions.find({ userId: userid, problemId: problemid });

        // console.log(answer)
        if(answer.length==0){
            return res.status(200).json([]);
        }
        res.status(200).json(answer)


    }
    catch(err){
        res.status(500).send("error :- " + err);
    }
}

   
    



module.exports = {createProblem,updateproblem,deleteproblem,getproblembyid,getAllProblem,solvedallProblembyuser,submittedproblem};

