import jwt from "jsonwebtoken"
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    //there is token inside the header and in token first bearer is written
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {

        //it would remove the bearer from the token

        //Bearer gjdjkncbjdkkd
      token = req.headers.authorization.split(" ")[1];

      //decodes token id
      //becox we generate the jwt with id and "minakshi" so it would give the id only
      const decoded = jwt.verify(token,"minakshi");

      //it would find the user which id decoded and store it in the req.user 
      //except password it won't store the password becoz everyone can see that
      //it would store the details of that user which is logged in
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

export default {protect};