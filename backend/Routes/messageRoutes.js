import  express  from "express";
import pro from '../middleware/authMiddleware.js'
import message from '../controllers/messageControllers.js'
// const {
//   allMessages,
//   sendMessage,
// } = require("../controllers/messageControllers");



const router = express.Router();

//fetch all of the messages of given id
router.route("/").get(pro.protect, message.allMessages);

//this would for send a message
router.route("/").post(pro.protect, message.sendMessage);

export default router