
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
  // here is the content and the chatId in which we want to send a message
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    // logged in user's id
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    // create a new message
    var message = await Message.create(newMessage);

    // populate sender and chat fields
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");

    // populate additional details
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    // update the latest message of the chat
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    // find the chat with this chat id
    var chat = await Chat.findById(chatId);

    if (chat) {
      // increment the message count unseen for the other user
      console.log(chat.messageCountUnseen)
      chat.messageCountUnseen.forEach((obj) => {
        if (obj.id.toString() !== req.user._id.toString()) {
          obj.number += 1;
        }
      });

      // save the updated chat
      await chat.save();
    } else {
      console.log("Chat not found");
    }

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});



export default { allMessages, sendMessage };