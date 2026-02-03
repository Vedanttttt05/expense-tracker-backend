import {asyncHandler} from '../utils/asyncHandler.js';
import apiError from '../utils/apiError.js';
import { User } from '../models/user.model.js';
import  apiResponse  from '../utils/apiResponse.js';
import mongoose from "mongoose";

const registerUser = asyncHandler (async (req, res) => {

    const { fullName, email, username, password } = req.body;

    if ([username , email , password,fullName].some((field) => field?.trim() === "")){
        throw new apiError(400 ,"All fields are required" );
    }
    const existingUser = await User.findOne({
        $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }]
    })

    if(existingUser){
        throw new apiError(409 , "User with provided email or username already exists");
    }

    const user = await User.create({
        fullName,
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        password
    })
    const userCreated = await User.findById(user._id).select("-password -refreshToken");

    if(!userCreated){
        throw new apiError(500 , "Error creating user. Please try again later.");
    }

    res.status(201).json(new apiResponse(201 , "User registered successfully" , userCreated));

});