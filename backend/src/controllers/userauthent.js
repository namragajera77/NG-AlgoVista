
const User  = require('../models/user')
const submissions = require('../models/submission')
const validate = require('../utils/validator')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookie = require("cookie");
const redisClient = require("../config/redis");





const register = async (req,res) => {
    try{
        validate(req.body);

        const { firstname, emailid, password } = req.body;

        req.body.password = await bcrypt.hash(password, 10);
        req.body.role = 'user'; // Default role for regular users

        const user = await User.create(req.body);
        const token = jwt.sign({_id:user._id, emailid:emailid, role:'user'}, process.env.JWT_KEY, {expiresIn: 60*60});
        res.cookie('token', token, {maxAge: 60*60*1000});

        const reply = {
            firstname: user.firstname,
            lastname: user.lastname,
            emailid: user.emailid,
            _id: user._id,
            role: user.role
        }

        res.status(200).json({
            user: reply,
            message: "Registration successful"
        });
    }
    catch(err){
        console.error('Registration error:', err);
        res.status(400).json({ message: err.message || "Registration failed" });
    }
}


const login = async (req,res)=>{
    try{
        const {emailid, password} = req.body;

        if(!emailid)
            return res.status(400).json({ message: "Email is required" });
        if(!password)
            return res.status(400).json({ message: "Password is required" });

        const user = await User.findOne({emailid});

        if(!user) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        const match = await bcrypt.compare(password, user.password);

        if(!match) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        const token = jwt.sign({_id:user._id, emailid:emailid, role:user.role}, process.env.JWT_KEY, {expiresIn: 60*60});
        res.cookie('token', token, {maxAge: 60*60*1000});

        const reply = {
            firstname: user.firstname,
            lastname: user.lastname,
            emailid: user.emailid,
            _id: user._id,
            role: user.role
        }

        res.status(200).json({
            user: reply,
            message: "Login successful"
        });

    }
    catch(err){
        console.error('Login error:', err);
        res.status(500).json({ message: "Internal server error" });
    }
}


const logout = async (req,res) => {
    try{
        const {token} = req.cookies;
        const payload = jwt.decode(token);

        await redisClient.set(`token:${token}`, 'blocked') ;
        await redisClient.expireAt(`token:${token}`,payload.exp);

        res.cookie("token", null , {expires : new Date(Date.now())});
        res.send("Logged Out Successfully");

    }
    catch(err){
        res.status(503).send("Error: " + err);
    }
}  

const adminregister = async (req,res) => {
    try{

         validate(req.body);

        const { firstname , emailid ,password} = req.body;


        req.body.password = await bcrypt.hash(password, 10);
        
        // req.body.role = 'admin'; 

        
        const user =  await User.create(req.body);
        const token =  jwt.sign({_id:user._id , emailid:emailid,role : user.role },process.env.JWT_KEY,{expiresIn: 60*60});
        res.cookie('token',token,{maxAge: 60*60*1000});
        res.status(201).send("Admin Registered Successfully");

    }
    catch(err){
        res.status(400).send("error" + err);
    }

}

const profiledelete = async (req,res) => {

    try{
    const userid = req.result._id;
    await User.findByIdAndDelete(userid);

    await submissions.deleteMany({userid});

    res.status(200).send("user delete succesfully");
    }
    catch(err){
        res.status(500).send("error :- " + err);
    }




};


module.exports = {

    register,
    login,
    logout,
    adminregister,
    profiledelete,
    
}

 