import jwt from 'jsonwebtoken';
import { User } from "../models/userModel.js"
import bcrypt from "bcrypt"
import getDataUri from '../utils/dataUri.js';
import cloudinary from '../utils/cloudinary.js';

const createToken = (email, userId) => {
    return jwt.sign({email, userId}, process.env.JWT_KEY, {expiresIn: "1d"})
}

export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required", success: false });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists", success: false });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      email,
      password: hashedPassword
    });

    res.cookie("authToken", createToken(email, user._id), {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict"
    });

    return res.status(201).json({
      user: {
        _id: user._id,
        email: user.email,
        profileSetup: user.profileSetup
      },
      success: true,
      message: "User signup successfully"
    });

  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required", success: false });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found", success: false });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Password is incorrect", success: false });
    }

    res.cookie("authToken", createToken(email, user._id), {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict"
    });

    return res.status(200).json({
      user: {
        _id: user._id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color
      },
      success: true,
      message: "User login successfully"
    });

  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};


export const profile = async (req, res) => {
    try {
        const user = await User.findById(req.userId)

        if(!user) {
            return res.status(400).json({
                message: "User with the given email not found",
                success: false
            })
        }
        
        return res.status(201).json({
            user: {
                _id: user._id,
                email: user.email,
                profileSetup: user.profileSetup,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                color: user.color
            },
            message: "User login successfully",
            success: true
        })

    } catch (error) {
        console.log(error)
        return res.status(400).json({ 
            message: error.message,
            success: false
         });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const {firstName, lastName, color} = req.body;

        if (!firstName || !lastName) {
            return res.status(400).json({
                message: "FirstName and lastName is required",
                success: false
            });
        }

        const user = await User.findById(req.userId)

        user.firstName = firstName;
        user.lastName = lastName;
        user.color = color;
        user.profileSetup = true;
        await user.save();
        return res.status(200).json({
            user: {
                _id: user._id,
                email: user.email,
                profileSetup: user.profileSetup,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                color: user.color
            },
            message: "User profile updated successfully",
            success: true
        });
    } catch (error) {
        console.log(error)
        return res.status(400).json({ 
            message: error.message,
            success: false
         });
    }
}

export const addProfileImage = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileUri = getDataUri(file);

    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    const user = await User.findById(req.userId);

    if (cloudResponse) {
      user.image = cloudResponse.secure_url;
    }

    await user.save();

    return res.status(200).json({
      image: user.image,
      message: "Profile image added successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: error.message,
      success: false,
    });
  }
};

export const deleteProfileImage = async (req, res) => {
    try {
        const user =  await User.findById(req.userId);
        user.image = null;
        await user.save();
        return res.status(200).json({
            message: "Profile image deleted successfully",
            success: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({   
            message: error.message,
            success: false,
        });
    }
}

export const logout = async (req, res) => {
    try {
        return res.cookie("authToken", null, {
            maxAge: 0,
            httpOnly: true,
            sameSite: "strict"
        }).status(200).json({
            message: "User logged out successfully",
            success: true
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({ 
            message: error.message,
            success: false
         });
    }
}
