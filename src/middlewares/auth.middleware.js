import {asyncHandler} from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import ApiError  from "../utils/apiError.js";
import {User} from "../models/user.model.js";

export const verifyJwt = asyncHandler (async (req,res,next) => {
    
  const authHeader = req.header("Authorization");

  const token =
    req.cookies?.accessToken ||
    (authHeader?.startsWith("Bearer ") && authHeader.split(" ")[1]);

  if (!token) {
    throw new ApiError(401, "Access denied");
  }

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  const user = await User.findById(decoded.userId).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new ApiError(401, "Access denied");
  }

  req.user = user;
  next();


})

