import express from 'express'
import pro from '../middleware/authMiddleware.js' 

//this is the way to use multiple variable and fxn of file
import user from '../controllers/userController.js'

const router=express.Router();

//this protect middleware would call first after allUsers would call to check the which user is logged in
//we can access the methods direct we have to use with a.b
router.get('/',pro.protect,user.allUsers)
router.post('/signup',user.registerUser)
router.post('/login',user.authUser)


export default router