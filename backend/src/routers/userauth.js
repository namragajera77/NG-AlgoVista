const express = require('express');
const { register, login , logout , adminregister,profiledelete} = require('../controllers/userauthent')
const middleware = require("../middleware/usermiddleware");

const adminmiddleware = require("../middleware/adminmiddleware");
const usermiddleware = require('../middleware/usermiddleware');

const authRouter = express.Router();

authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.post('/logout',middleware,logout);
authRouter.post('/admin/register',adminmiddleware,adminregister);
authRouter.delete('/deleteprofile',usermiddleware,profiledelete)
authRouter.get('/check',usermiddleware,(req,res)=>{
    const reply = {
        firstname:req.result.firstname,
        emailid:req.result.emailid,
        _id:req.result._id,
        role:req.result.role
    }

    res.status(200).json({
        user:reply,
        message:"valid user"
    })
})



module.exports = authRouter;

