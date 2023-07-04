import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userModel=mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
        },
        mail:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true
        },
        pic:{
            type:String,
            default:"https://www.vecteezy.com/free-vector/user-icon"

        }

},{
    timestamps:true
})

// decrypt the password first and than match it with our enteredpassword
//this is the fxn which would be in user model
//it would be in user object we can access it
// userModel.methods.matchPassword=async function(enteredPassword){
//     try {
//         const match=await bcrypt.compare(this.password,enteredPassword)
//         return match
        
//     } catch (error) {
//         console.log(error.message)
        
//     }
    

// }

userModel.methods.matchPassword=async function(enteredPassword)
{   
    return enteredPassword==this.password;
}



//to decrypt the password as we cant store our password in database simply we have to decrypt it first
//before saving the password do encrypt it first


userModel.pre('save',async function(){
    bcrypt.hash(this.password, 10, (err, hashedPassword) => {
  if (err) {
    console.error(err);
    // Handle error
  } else {
    // Store the hashedPassword in the database
   this.password= hashedPassword;
  }
});

})



const User=mongoose.model("User",userModel)

export default User