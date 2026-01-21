
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const redisClient = require("../config/redis")

const adminmiddleware = async (req,res,next)=>{
    console.log('Admin middleware called for:', req.method, req.path);

    try{

        const {token} = req.cookies;
        if(!token)
            throw new Error("Token is not persent");

        const payload = jwt.verify(token,process.env.JWT_KEY);

        const {_id} = payload;

        if(!_id){
            throw new Error("Invalid token");
        }

        if(payload.role !== 'admin') {
            throw new Error("Access denied: Admins only");
        }   

        const result = await User.findById(_id);

        if(!result){
            throw new Error("User Doesn't Exist");
        }

        // Redis ke blockList mein persent toh nahi hai

        const IsBlocked = await redisClient.exists(`token:${token}`);

        if(IsBlocked)
            throw new Error("Invalid Token");

        req.result = result;

        console.log('Admin middleware passed, user:', result._id, 'role:', result.role);
        next();
    }
    catch(err){
        console.error('Admin middleware error:', err.message);
        res.status(401).send("Error: "+ err.message)
    }

}


module.exports = adminmiddleware;