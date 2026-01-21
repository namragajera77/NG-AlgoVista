const express = require('express');
const app = express();
const main = require('./src/config/db');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const authRouter = require('./src/routers/userauth');
const redisclient = require('./src/config/redis');
const problemRouter = require('./src/routers/problemcreator');
const submitrouter = require('./src/routers/submit')
const aiRouter = require("./src/routers/aiChatting")
const videoRouter = require("./src/routers/videoCreator")
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));


app.use(express.json());
app.use(cookieParser());
app.use('/user', authRouter);
app.use('/problem', problemRouter);
app.use('/submission',submitrouter)
app.use('/ai',aiRouter);
app.use('/video',videoRouter)


const intializeconnection = async () => {

    try{
        await main();
        console.log('Database connection established successfully');
        
        // Redis connection is optional
        redisclient.connect().catch(err => {
            console.warn('Redis connection failed, continuing without cache');
        });

         app.listen(process.env.PORT, () => {
            console.log('Server is running on port number :', process.env.PORT);
        });
    }
    catch(err){
        console.log('Error in establishing connections:', err);
    }
}

intializeconnection();



