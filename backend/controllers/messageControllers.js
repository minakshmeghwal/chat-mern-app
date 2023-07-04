
import asyncHandler from 'express-async-handler'
import mongoose from 'mongoose'

import Message from '../models/messageModel.js'
import User from '../models/userModel.js'
import Chat from '../models/chatModel.js'

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
const allMessages = asyncHandler(async (req, res) => {
  try {

    //here params is for the it would send the id of that chat which all messages we want to fetch

    // in a postman the only query params works
    const messages = await Message.find({ chat: req.query.chatId })
    //us id ke sender ke name pic email fetch kare
      .populate("sender", "name pic email")
      //than usme jo chat hai woh fetch kare
      .populate("chat");

      //now it would send the all messages
    res.json(messages);
  } catch (error) {
    console.log(error.message)
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = asyncHandler(async (req, res) => {

    //here is the content and the chatId in which we want to send a message
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  

  var newMessage = {
    //logged in users id
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    //we have created a message model
    var message = await Message.create(newMessage);

    //we are populating the sender name and picture
    //example we are populating on a sender which containing the user
    // so it will go to the user and it will send the all details which written in user

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");

    //it will populate all the details of both users
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });
    

    //we find the chat with this chat id and update the latest message with current msg
    var chat1=Chat.findById(chatId);

    // chat1.messageCountUnseen.map((obj)=>{
    //   if(obj.id!=req.user._id)
    //   {
    //     obj.number+=1;
    //   }
    // })
    
    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export default { allMessages, sendMessage };