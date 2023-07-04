//there is express async handler which handles the errors automaticly
import asyncHandler from 'express-async-handler'

import User from '../models/userModel.js'
import generateToken from '../config/generateToken.js';

const registerUser=asyncHandler(async(req,res)=>{
    //through this we can get value in a multiple variable in one line
    console.log(req.body);
    const {name,mail,password,pic}=req.body;

    if(name===undefined || mail===undefined || password===undefined)
    {
        res.status(400);
        throw new Error("Please enter all the credentials")
    }

    const userExist= await User.findOne({mail})

    if(userExist)
    {   
        //used for sending am error on a website
         res.status(400);
        throw new Error("User exist already")
    }

    const user= await User.create({
        name,
        mail,
        password,
        pic

    }
    )
    if(user)
    {   
        //used to send an json file on frontend

        //here it would also pass the jwt token it is a cookie which we would pass
        res.status(201).json({
            _id:user._id,
            name:user.name,
            mail:user.mail,
            password:user.password,
            pic:user.pic,
            token:generateToken(user._id)
        })
    }
    else{
        res.status(400)
        throw new Error("failed to create a new user")
    }
    
})


const authUser=asyncHandler(async(req,res) =>{

    console.log("body",req.body)
    
    //we can pass all req.body object value in one line
    const {mail,password}=req.body;
    if(mail===undefined || password===undefined)
    {
        res.status(400);
        throw new Error("Please enter all the credentials")
    }


    const user=await User.findOne({mail});


    console.log("user",user)

    //matchPassword is a fxn we created in model which would be avaible in user object
    if(user)
    {       
            try {
                const passwordMatch = await user.matchPassword(password);
            if (passwordMatch) {
                res.json({
                        _id:user._id,
                        name:user.name,
                        mail:user.mail,
                        password:user.password,
                        pic:user.pic,
                        token:generateToken(user._id)
            
                    })
            } else {
                console.log(passwordMatch)
                res.status(400)
                    throw new Error("Invalid password")
            }
            } catch (error) {
                console.error(error.message);
            }
           

        
    }
    else{
         res.status(400)
        throw new Error("Invalid email")
    }

})


//this handle /user api
//this handle query in which we would give api in ?search=minakshi in this format

//this is for searching the users for a chat
const allUsers=asyncHandler( async(req,res)=>{
    const keyword=req.query.search ?{
        //$or is used to compare req.query.search with different-2 variablein a database
        //here regex is used for a pattern matchiung string
        //options show that is it should be case sensitive matching or not
        $or:[
            {name :{$regex : req.query.search,$options :"i"}},
            {mail : {$regex : req.query.search,$options :"i"}}
        ]
    }:{
        //else we are not doing anything
    }
    
    //it would find all the users which get in a keyword
    //here $ne is for not equal
    //here we would search the all user except the user which is logged in
    //we can't search the user whivh is logged in
    const users=await User.find(keyword).find({_id:{$ne : req.user._id}})
    res.send(users);
    

})

//this is the way to export multiple fxn or variable
export default {registerUser ,authUser,allUsers}

// module.exports={registerUser}