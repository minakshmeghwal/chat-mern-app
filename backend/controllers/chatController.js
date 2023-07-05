import asyncHandler from 'express-async-handler'
import mongoose from 'mongoose'
import Chat  from "../models/chatModel.js";
import User from "../models/userModel.js";

//this fxn will return the all chats of a user which id is given or will create a empty chat section
const accessChat=asyncHandler(async(req,res)=>{

    //in req.body their is id present through which the user want to chat with

    //we can;t use the req.body.userId directly 
    //we have to first trim that than we convert it into objectId becoz we are not getting the objectid
    let userId= req.body.userId
   if (typeof userId === 'string') {
           userId = userId.trim();
        }
      userId = new mongoose.Types.ObjectId(userId);

    if(!userId)
    {
        console.log("userId params query not send with request")
        return res.sendStatus(400)

    }
    
    //check if chat exist with that user
    //isgroup chat should be false
    //and operator would check if both the element is true it would send that
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })// if chat exist than find the all users details except password becoz in users we have on ids
    .populate("users", "-password")
    //than after that populate lastestmessage id it will tell
    .populate("latestMessage");

    // now we would populate the latestmessage sender id and through that we would populate the details of that
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    //if chat exist than return it
    res.send(isChat[0]);
  } else {
    //if chat doesn't exist than create it and send the user ids both
    //it would create the chat
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
      messageCountUnseen:[
        {
        number:0 , 
        id: req.user._id
      },
        {
          number:0,
          id: userId
        }
      ]
    };
    try {
        //it created a chat with above data is given with both ids
      const createdChat = await Chat.create(chatData);
      
      //it would show the all details of that both users which chat is created except password
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }

  }

})

//to fetch the all chats with all users
const fetchChats=asyncHandler(async(req,res)=>{

  try {
    //inside chat model we would find all the chat users which it a part of
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      //it would populate all the messages
      .populate("latestMessage")
      //it will sort it by new to old messages
      .sort({ updatedAt: -1 })

      //it will populate all the message sender details name pic all
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400)
    throw new Error(error.message)
  }

})


//to create a group chat
const createGroupChat = asyncHandler(async (req, res) => {

  //the group chat would containing name of group and users
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }

  //from frontend it would pass the users in stringify format
  //and now we would convert into object using json.parse
  var users = JSON.parse(req.body.users);

  //goup should have more than 2 users
  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  //now in a array of users we would pass the current logged in user
  //becos that would also part of that group
  var arr;
  users.push(req.user);
  if(!users)
  {
  users.map((user)=>{
    const newItem = {
      number: 0,
      id: user
    };
      arr.push(newItem);
    
  })
}

  try { 
    //create a group chat and it would return the group details
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      //groupadmin would be current user which is logged in
      groupAdmin: req.user,
      messageCountUnseen:arr
      
      
    });

    //after created a group chat populate all details from that chats
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);

  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});


const renameGroup = asyncHandler(async (req, res) => {

  //it would give chat Id and updated name which we want change
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    { //if we use new as a true it woul return a new name 
      //if we don't use this then it will return the old one
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});


const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
});


const addToGroup = asyncHandler(async (req, res) => {

  //chatId i which we want to add in
  //userId which user we want to add
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const added = await Chat.findByIdAndUpdate(
    chatId,
    { 
      //to push that user into the users array
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

      //it means that given chat doesnot exist
  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
});

const notify = asyncHandler(async (req, res) => {
let chatId = req.body.chatId;

  if (typeof chatId === 'string') {
    chatId = chatId.trim();
  }
  chatId = new mongoose.Types.ObjectId(chatId);

  if (!chatId) {
    return res.sendStatus(400);
  }

  console.log("hey");

  const userId = req.user._id;
  console.log("fhd", chatId);
  console.log("shdkd", userId);


  const chat = await Chat.findOneAndUpdate(
  { _id: chatId, 'messageCountUnseen.id': userId },
  { $set: { 'messageCountUnseen.$.number': 0 } },
  { new: true } // Set the "new" option to true to return the updated document
);

if (!chat) {
  // If no chat is found, handle the case accordingly
  return res.status(404).json({ error: 'Chat not found' });
}

console.log(chat);
return res.json(chat);




  
});




export default {accessChat,fetchChats,createGroupChat,renameGroup,addToGroup,removeFromGroup,notify}