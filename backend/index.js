import express from 'express'
import csp from 'helmet-csp'
import helmet from 'helmet'
import bodyParser from 'body-parser'
//this is how we add the variable in other file


import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db.js'
import userRoutes from './Routes/userRoutes.js'
import chatRoutes from './Routes/chatRoutes.js'
import messageRoutes from './Routes/messageRoutes.js'
import {Server } from "socket.io"

// import { notFound } from './middleware/errorMid'
// import { errorHandler } from './middleware/errorMid'




//const chat=require('./Chat.js')

//call the connect db fxn so that it would connect with mongodb


//this is for if we dont want to show the port
dotenv.config();


connectDB();
const app=express();

app.use(express.json())


app.use(bodyParser.json({limit:"30mb",extended:true})) //here 30mb limit is for we would store a image or send request
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}))

//to tell our server to accept json files which soming from frontend


app.use(cors())



//after /user router use userRoutes file
app.use('/user',userRoutes)

// for /chat go to chatRoutes
app.use('/chat',chatRoutes)

app.use('/message',messageRoutes)
//create express js api
app.get('/',(req,res)=>{
    res.send("API is running")
})

app.get('/your-route', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  // Handle the route logic and send the response
  res.send('Your response');
});

//if going above all url if url is not found than it will go on notFound function which handle the url not found fxn
// app.use(notFound);

// //if there is another error than url not found than it will go on errorHandler
// app.use(errorHandler)


//if u dont want to show port number istead of that we can use this and PORT is store in .env file
const port=process.env.PORT || 5000
const server=app.listen(port,function(error){
        if(error)
        {
            console.log(error.message);
            return;
        }
        console.log("Server is running on ",port)

})



//real time chat using socket.io provided server which listening on port 5000
//it contains cors which handle cross orgin error
const io = new Server(server, {

  //after 60 sec if the user dont send anything it close
  pingTimeout: 60000,
  cors: {

    //port is frontend is 3000
    origin: "http://localhost:3000",
    // credentials: true,
  },
});

//create a connection "connection" is name
io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  //here we are a new socket where frontend will send some data and join a room
  //userData is data coming from frontend
  socket.on("setup", (userData) => 
  { //we are creatin a new room with id of data
    //and that room would exclusive to that user only
    socket.join(userData._id);

    //it emit connected
    socket.emit("connected");
  });

  //it will creste a room which get id from frontend room
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

//for a typing .... show we use this socket
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  //we created a new socket with new message for recieved message
  socket.on("new message", (newMessageRecieved) => {

    //it will find for which chat this message belongs to
    //it will give the chat data
    var chat = newMessageRecieved.chat;

    //if that chat dont have and users
    if (!chat.users) return console.log("chat.users not defined");

    //if am sending a chat than it would send a message all the user except me
    chat.users.forEach((user) => {
      //you wont send this message bacck to me
      if (user._id == newMessageRecieved.sender._id) return;

      //above we created a user.id socket for there we would send message
      //in used means inside this
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  //to destroy the socket
  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});