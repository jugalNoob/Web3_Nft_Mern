const express=require('express')
const cookieParser = require('cookie-parser');
const startServer = require('./Cluster/clust')
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
const Port=process.env.PORT || 9000  // .env port number is 041
startServer(app, Port);  /// function loadbalance use for cluster management 


app.use(express.json())
app.use(cors(corsOption));
app.use(router)
app.use(cookieParser());


module.exports = app;



// app.listen(Port , ()=>{
//     console.log(`Server is running on port ${Port}`)
// })



// const express = require('express');
// const router = require('./routes/router');
// const startServer = require('./Cluster/clust');
// const morgan = require('morgan');
// const start=process.hrtime()




// const app = express();
// const port = 9000;

// app.use(router);


// app.use(morgan('combined'))  /// morgan for respones:: get information 

// startServer(app, port);  /// function loadbalance use for cluster management 
// const end=process.hrtime(start)

// const latencyInMs=end[0]*1000+end[1]/1e6;

// console.log(`Latency: ${latencyInMs} ms`)  //check if latency


// // Start the server using cluster management
// module.exports = app;


