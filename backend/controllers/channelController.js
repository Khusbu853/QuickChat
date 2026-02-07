import { User } from "../models/userModel.js";
import { Channel } from "../models/channelModel.js";
import mongoose from "mongoose";

export const createChannel = async (req, res) => {
    try {
        const {name, members} = req.body;
        const userId = req.userId;

        const admin = await User.findById(userId);

        if(!admin) {
            return response.status(400).send("Admin user not found");
        }

        const validMembers = await User.find({_id: { $in: members}});

        if(validMembers.length !== members.length) {
            return response.status(400).send("Some members are not valid user")
        }

        const newChannel = new Channel({
            name,
            members,
            admin: userId
        });

        await newChannel.save();

        return res.status(201).json({ 
            channel: newChannel,
            message: "Channel data fetched successfully",
            success: true
         });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ 
            message: error.message,
            success: false
         });
    }
}


export const getUserChannels = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.userId);

        const channels = await Channel.find({
            $or: [{admin: userId}, {members: userId}]
        }).sort({updatedAt: -1});

        return res.status(201).json({
            channels,
            message: "Channels fetched successfully",
            success: true
        });

    } catch (error) {
        console.error(error);
        return res.status(400).json({
            message: error.message,
            success: false
        });
    }
};

export const getChannelMessages = async (req, res) => {
    try {
        const {channelId} = req.params;
        const channel = await Channel.findById(channelId).populate({
            path: "messages",
            populate: {
                path: "sender",
                select: "firstName lastName email _id image color"
            }
        })

        if(!channel) {
            return res.status(400).json({ message: "No Channel found" });
        }

        const messageData = channel.messages;
        return res.status(201).json({
            messageData,
            message: "Channels messages fetched successfully",
            success: true
        });

    } catch (error) {
        console.error(error);
        return res.status(400).json({
            message: error.message,
            success: false
        });
    }
};