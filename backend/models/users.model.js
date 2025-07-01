import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String, 
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true
    }
});

const User = mongoose.model("user", userSchema);

export default User;