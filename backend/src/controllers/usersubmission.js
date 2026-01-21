const Problem = require('../models/problem');
const Submissions = require('../models/submission')
const {getLanguageById,submitBatch,submitToken} = require('../utils/problemUtility')

const usersubmission =  async (req,res)=>{   
    try{
        const userId = req.result._id;
      
        const problemId = req.params.id;

        let {code,language}= req.body;

        

        if(language==='cpp'){
        language='c++'
      }

        if(!userId || !problemId || !code || !language){
            return res.status(400).send("some field missing");
        }

        const problem = await Problem.findById(problemId);
        if (!problem) {
          return res.status(404).send("Problem not found");
        }


        const submittedResult = await Submissions.create({
            userId,
            problemId,
            code,
            language,
            testCasesPassed:0,
            status:"pending",
            testCasesTotal:problem.hiddenTestCases.length
        })

        const languageId = getLanguageById(language);

         const submissions = problem.hiddenTestCases.map((testcase)=>({
            source_code:code,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }));

        const submitResult = await submitBatch(submissions);

        const resulttoken = submitResult.map((result)=>result.token);
        
        const testresult = await submitToken(resulttoken);

        // console.log(testresult);

         // submittedResult ko update karo
    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = 'accepted';
    let errorMessage = null;


    for (const test of testresult) {
  if (test.status_id === 3) {
    testCasesPassed++;
    runtime += parseFloat(test.time || 0);
    memory = Math.max(memory, test.memory || 0);
  } else {
    switch (test.status_id) {
      case 4:
        status = 'error';
        errorMessage = test.stderr || 'Runtime Error';
        break;
      case 5:
        status = 'time limit exceeded';
        errorMessage = 'Time Limit Exceeded';
        break;
      case 6:
        status = 'compilation error';
        errorMessage = test.compile_output || 'Compilation Error';
        break;
      case 7:
        status = 'memory limit exceeded';
        errorMessage = 'Memory Limit Exceeded';
        break;
      default:
        status = 'wrong';
        errorMessage = test.stderr || test.message || 'Wrong Answer or Judge Error';
        break;
    }
  }
}



    // Store the result in Database in Submission
    submittedResult.status   = status;
    submittedResult.testCasesPassed = testCasesPassed;
    submittedResult.errorMessage = errorMessage;
    submittedResult.runtime = runtime;
    submittedResult.memory = memory;

    await submittedResult.save();

    // console.log("req.result =>", req.result);

    //req.result === user information

if (!req.result) {
  return res.status(400).send("User not found");
}

if (!Array.isArray(req.result.problemSolved)) {
  req.result.problemSolved = [];
}


if (!req.result.problemSolved.includes(problemId)) {
  req.result.problemSolved.push(problemId);
  await req.result.save();
}

     const accepted = (status == 'accepted')
    res.status(201).json({
      accepted,
      totalTestCases: submittedResult.testCasesTotal,
      passedTestCases: testCasesPassed,
      runtime,
      memory
    });


    }
    catch(err){
        res.status(400).send("error" + err)
    }
}
const runCode = async(req,res)=>{
  try{
    const userId = req.result._id;
    const problemId = req.params.id;
    let {code,language} = req.body;

    console.log(code,language);

    if(language==='cpp'){
      language='c++'
    }

    if(!userId||!code||!problemId||!language)
      return res.status(400).send("Some field missing");

    const problem =  await Problem.findById(problemId);

    const languageId = getLanguageById(language);

    const submissions = problem.visibleTestCases.map((testcase)=>({
      source_code:code,
      language_id: languageId,
      stdin: testcase.input,
      expected_output: testcase.output
    }));

    const submitResult = await submitBatch(submissions);
  
    const resultToken = submitResult.map((value)=> value.token);
 
    const testResult = await submitToken(resultToken);
    

   

    // Build the response
    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = 'accepted';
    let errorMessage = null;

    // Build testCases array for frontend
    const testCases = testResult.map((test, idx) => {
      if (test.status_id === 3) {
        testCasesPassed++;
        runtime += parseFloat(test.time || 0);
        memory = Math.max(memory, test.memory || 0);
      }
      return {
        stdin: problem.visibleTestCases[idx].input,
        expected_output: problem.visibleTestCases[idx].output,
        stdout: test.stdout,
        status_id: test.status_id,
        time: test.time,
        memory: test.memory,
        stderr: test.stderr,
        compile_output: test.compile_output,
        message: test.message
      }
    });

   

    if (testCasesPassed !== testCases.length) {
      status = 'failed';
    }

    res.status(200).json({
      success: status === 'accepted',
      testCases,
      runtime,
      memory
    });
  }
  catch(err){
    res.status(500).send("Internal Server Error "+ err);
  }
}
module.exports = {usersubmission,runCode};