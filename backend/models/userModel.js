import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Email is not valid");
            }
        },
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    firstName: {
        type: String,
        required: false,
    },
    lastName: {
        type: String,
        required: false,
    },
    image: {
        type: String,
        required: false,
    },
    color: {
        type:Number,
        required: false
    },
    profileSetup: {
        type: Number,
        default: false,
    }
}, {
    timestamps: true,
})


export const User = mongoose.model('User', userSchema);