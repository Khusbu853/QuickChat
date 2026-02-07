import { Message } from "../models/messagesModel.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from '../utils/cloudinary.js';

export const getMessages = async (req, res) => {
    try {
        const receiverId = req.body.receiverId
        const senderId = req.userId


        if(!senderId) {
            return res.status(400).json({ message: "senderId is required", success: false });
        }
        if(!receiverId) {
            return res.status(400).json({ message: "receiverId is required", success: false });
        }

        const messageData = await Message.find({
            $or: [
                {sender: senderId, receiver: receiverId},
                {sender: receiverId, receiver: senderId}
            ]
        }).sort({timestamp: 1})


        return res.status(200).json({ 
            messageData,
            message: "Messages fetched successfully",
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


export const uploadFile = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        message: "File is required",
        success: false,
      });
    }
    const fileUri = getDataUri(file);

    const cloudResponse = await cloudinary.uploader.upload(
      fileUri.content,
      {
        resource_type: "auto",
        folder: "chat-files",
      }
    );

    if (!cloudResponse?.secure_url) {
      return res.status(500).json({
        message: "File upload failed",
        success: false,
      });
    }

    return res.status(200).json({
      filePath: cloudResponse.secure_url,
      message: "File uploaded successfully",
      success: true,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};