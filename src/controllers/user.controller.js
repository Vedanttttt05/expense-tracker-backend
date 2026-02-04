import {asyncHandler} from '../utils/asyncHandler.js';
import apiError from '../utils/apiError.js';
import { User } from '../models/user.model.js';
import  apiResponse  from '../utils/apiResponse.js';
import mongoose from "mongoose";


// //avatar handling remained to be added
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

const loginUser = asyncHandler (async (req, res) => {

    const { identifer , password } = req.body;

    if ([identifer , password].some((field) => field?.trim() === "")){
        throw new apiError(400 ,"All fields are required" );
    }
    const user = await User.findOne({
        $or: [{ email: identifer.toLowerCase() }, { username: identifer.toLowerCase() }]
    }).select("+password +refreshToken");
    if(!user){
        throw new apiError(401 , "Invalid credentials");
    }
    if (user.isLocked) {
    throw new apiError(423, "Account is temporarily locked. Try again later.");
    
    }


    const isPasswordValid = await user.comparePassword(password);
    if(!isPasswordValid){
        user.loginAttempts += 1;

        if (user.loginAttempts >= 5) {
            user.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // Lock for 30 minutes
            await user.save({ validateBeforeSave: false });
            throw new apiError(423, "Account locked due to multiple failed login attempts. Try again later.");
        }
        await user.save({ validateBeforeSave: false });
        throw new apiError(401 , "Invalid credentials");
        
    }
    if (!user.isEmailVerified) {
        throw new apiError(403, "Please verify your email before logging in");
    }



    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    user.lastLoginAt = new Date();
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save({ validateBeforeSave: false });

    const userData = await User.findById(user._id).select("-password -refreshToken");

    res.status(200).json(new apiResponse(200 , "User logged in successfully" , {
        user : userData,
        accessToken,
        refreshToken
    }));


});

