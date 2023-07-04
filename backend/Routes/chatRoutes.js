import express from 'express'
import pro from '../middleware/authMiddleware.js'
import chat from '../controllers/chatController.js'

const router=express.Router();

//put request is basically when we want to update something in a db

//it would call first protect which would check wether token exist and open that user profile
router.post('/',pro.protect, chat.accessChat);
router.get('/',pro.protect, chat.fetchChats);
router.post('/group',pro.protect, chat.createGroupChat);
router.put('/rename',pro.protect, chat.renameGroup);
router.put('/groupremove',pro.protect, chat.removeFromGroup);
router.put('/groupadd',pro.protect, chat.addToGroup);


export default router