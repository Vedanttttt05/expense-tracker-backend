import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const userSchema = new Schema({
    role : { type: String, enum: ["user" , "admin"] , default : "user"},

    username: { type: String, required: true, unique: true , lowercase: true, trim: true , index: true},

    email: { type: String, required: true ,unique: true, lowercase: true, trim: true },

    isEmailVerified : { type : Boolean , default : false},

    fullName: { type: String, required: true , trim: true  , index :true},

    avatar: { type: String },

    avatarPublicId: { type: String },

    password: { type: String, select: false, required: function(){
        return this.provider === "local";
    } },

    refreshToken: { type: String  , select : false },

    lastLoginAt : { type : Date} ,

    provider :{
        type : String,
        enum : ["local" , "google" , "facebook"],
        default : "local"
    },

    providerId : {
        type : String ,
        required : function(){
            return this.provider !== "local";
        }   
    },

    loginAttempts : { type : Number , default : 0 },

    lockUntil : { type : Date } ,

     passwordResetToken : { type : String , select : false } ,

     passwordResetExpires : { type : Date  }

}, { timestamps: true });


userSchema.pre("save", async function (next) {
    if (!this.isModified("password") || !this.password) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});


userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);    
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
        userId: this._id, 
        role : this.role
    } ,process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
    )}; 



userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
        userId: this._id,


    } ,process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
    )

};


userSchema.virtual("isLocked").get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});



const User = mongoose.model("User", userSchema);

export {User};