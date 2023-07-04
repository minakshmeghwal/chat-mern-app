import jwt from 'jsonwebtoken'

//this is a coockie and here our id and minakshi is secret code 
//it will expires in 30 days
const generateToken=(id)=>{

    return jwt.sign({id},"minakshi",{
        expiresIn:"30d"
    })

}

export default generateToken