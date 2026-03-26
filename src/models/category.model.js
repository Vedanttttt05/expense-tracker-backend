import mongoose , {Schema} from "mongoose";

const categorySchema = new Schema({
    

    name : {
        type : String,
        required : true,
        trim : true
    },
    type :{
        type : String,
        enum : ["income" , "expense"],
        required : true,
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,

    }

},
{
    timestamps: true
})

categorySchema.index({ user: 1, name: 1 }, { unique: true });

const Category = mongoose.model("Category" , categorySchema);
export { Category };
