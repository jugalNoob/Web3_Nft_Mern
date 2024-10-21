const express=require('express')
const cookieParser = require('cookie-parser');
const app=express()
const router = require('./routes/router');
const cors=require('cors')
require('./db/conn')
require('dotenv').config();


// CORS Configuration --------------------<><><><><>
const corsOption = {
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE,PATCH,HEAD",
    credentials: true
};




///all app.use 
const Port=process.env.PORT // .env port number is 041
app.use(express.json())
app.use(cors(corsOption));
app.use(router)
app.use(cookieParser());



app.listen(Port , ()=>{
    console.log(`Server is running on port ${Port}`)
})


