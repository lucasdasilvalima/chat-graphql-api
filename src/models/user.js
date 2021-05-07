import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    fullName:{
        type: String,
        require: true,
    },
    email:{
        type: String,
        require: true,
    },
    phoneNumber:{
        type: String,
        require: true,
    },
    isActive:{
        type: Boolean,
        default: false,
    },
    avatarURL: String,
    about: String
});

export default mongoose.model("User", Schema);