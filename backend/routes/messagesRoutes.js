import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getMessages, uploadFile } from "../controllers/messagesController.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.route("/getMessages").post(isAuthenticated, getMessages);
router.route("/upload-file").post(isAuthenticated, singleUpload, uploadFile)

export default router;