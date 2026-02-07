import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { createChannel, getChannelMessages, getUserChannels } from "../controllers/channelController.js";

const router = express.Router();

router.route("/create").post(isAuthenticated, createChannel);
router.route("/get-user-channel").get(isAuthenticated, getUserChannels);
router.route("/get-channel-messages/:channelId").get(isAuthenticated, getChannelMessages)

export default router;