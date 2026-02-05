import mongoose, { Schema } from "mongoose";

const transactionSchema = new Schema({

    amount : { type : Number , required : true , min :0 },
    type : { type : String , enum : ["income" , "expense"] , required : true },
    category : { type : String , required : true },
    date : { type : Date , required : true  , default : Date.now },
    note : { type : String  , required : false },
    user : { type : mongoose.Schema.Types.ObjectId , ref : "User" , required : true },
    isDeleted : { type : Boolean , default : false }
}
, { timestamps: true });

transactionSchema.index({ user: 1, date: -1 });

const Transaction = mongoose.model("Transaction" , transactionSchema);
export { Transaction };