import mongoose from 'mongoose'

//mongoose is used to connect our database with our server in which we use query

const chatModel=mongoose.Schema(
    {
        chatName:{
            type:String,
            trim:true
        },
        isGroupChat:{
            type:Boolean,
            default:false
        },
        users:[{
            //this is showing that it is having a user id
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }],
        latestMessage:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Message"

        },
        groupAdmin:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        } ,
        // messageCountUnseen:[{
        //     number: {
        //     type: Number,
        //     default:0
        //             },
        //     id: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "User",
            
        //         }
        // }]
},
{   //whenever we added chat it would add the time of that
    timestamps:true
})

//we created a model name Chat in which pass the chatModel object
const Chat=mongoose.model("Chat",chatModel)


//and export it so we can use it 
export default Chat