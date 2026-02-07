import { Server } from "socket.io";
import { Message } from "./models/messagesModel.js";
import { Channel } from "./models/channelModel.js";

const setupSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.ORIGIN, 
            credentials: true
        }
    });

    const userSocketMap = new Map();

    // disconnect the user and remove from map
    const disconnectHandler = (socket) => {
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId);
                console.log(`User disconnected: ${userId}`);
                break;
            }
        }
    };

    // handle sending message
    const sendMessage = async(message) => {
        const senderSocketId = userSocketMap.get(message.sender);
        const receiverSocketId = userSocketMap.get(message.receiver);

        const createdMessage = await Message.create(message);

        const messageData = await Message.findById(createdMessage._id)
        .populate("sender", "_id firstName lastName email image color")
        .populate("receiver", "_id firstName lastName email image color");

        // emit message to sender
        if (senderSocketId) {
            io.to(senderSocketId).emit("receiveMessage", messageData);
        }
        // emit message to receiver
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("receiveMessage", messageData);
        }
    }

    const sendChannelMessage = async(message) => {
        const {channelId, sender, content, messageType, fileUrl} = message;

        const createdMessage = await Message.create({
            sender,
            receiver: null,
            content,
            messageType,
            timestamp: new Date(),
            fileUrl
        });

        const messageData = await Message.findById(createdMessage._id)
        .populate("sender", "_id email firstName lastName image color").exec();

        await Channel.findByIdAndUpdate(channelId, {
            $push: { messages: createdMessage._id}
        })

        const channel = await Channel.findById(channelId).populate("members");

        const finalData = {...messageData._doc, channelId: channel._id}

        if (channel && channel.members) {
            channel.members.forEach((member) => {
                const memberSocketId = userSocketMap.get(member._id.toString());
                if (memberSocketId) {
                    io.to(memberSocketId).emit("receiveChannelMessage", finalData)
                }
            })
            const adminSocketId = userSocketMap.get(channel.admin._id.toString());
            if (adminSocketId) {
                io.to(adminSocketId).emit("receiveChannelMessage", finalData)
            }
        }
    }


    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        if (userId) {
            userSocketMap.set(userId, socket.id);
            console.log(`User connected: ${userId} with Socket ID: ${socket.id}`);
        } else {
            console.log("User ID not provided during connection");
        }

        socket.on("sendMessage", sendMessage)
        socket.on("sendChannelMessage", sendChannelMessage)
        socket.on("disconnect", () => disconnectHandler(socket));
    })

}

export default setupSocket;