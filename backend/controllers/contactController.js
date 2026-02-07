import { Message } from "../models/messagesModel.js";
import { User } from "../models/userModel.js";
import mongoose from "mongoose";

export const searchContacts = async (req, res) => {
    try {
        const { searchTerm } = req.body;

        const sanitizedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        const regex = new RegExp(sanitizedSearchTerm, 'i');
        const contacts = await User.find({
            $and: [{_id: {$ne: req.userId}}, 
                { $or: [ { firstName: regex }, { lastName: regex }, { email: regex } ] }
            ]
        })
        return res.status(200).json({ 
            contacts,
            message: "Contacts fetched successfully",
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


export const getContactsForDMList = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.userId);

        const dmContacts = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { sender: userId },
                        { receiver: userId }
                    ]
                }
            },
            {
                $sort: { timestamp: -1 }
            },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ["$sender", userId] },
                            "$receiver",
                            "$sender"
                        ]
                    },
                    lastMessageTime: { $first: "$timestamp" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "contactInfo"
                }
            },
            {
                $unwind: "$contactInfo"
            },
            {
                $project: {
                    _id: 1,
                    lastMessageTime: 1,
                    email: "$contactInfo.email",
                    firstName: "$contactInfo.firstName",
                    lastName: "$contactInfo.lastName",
                    image: "$contactInfo.image",
                    color: "$contactInfo.color"
                }
            },
            {
                $sort: { lastMessageTime: -1 }
            }
        ]);

        return res.status(200).json({
            dmContacts,
            message: "DM contacts fetched successfully",
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


export const getAllContacts = async (req, res) => {
    try {
        const users = await User.find(
            {_id: {$ne: req.userId}},
            "firstName lastName _id email"
        )

        const contacts = users.map((user) => ({
            label: user.firstName ? `${user.firstName} ${user.lastName}` : user.email,
            value: user._id,
        }))

        return res.status(200).json({
            contacts,
            message: "Contacts fetched successfully",
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