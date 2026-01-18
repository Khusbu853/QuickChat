import express from "express";
import { addProfileImage, login, profile, signup, updateProfile, deleteProfileImage, logout } from "../controllers/authController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/profile").get(isAuthenticated, profile)
router.route("/update-profile").post(isAuthenticated, updateProfile);
router.route("/add-profile-image").post(isAuthenticated, singleUpload, addProfileImage);
router.route("/delete-profile-image").post(isAuthenticated, deleteProfileImage);
router.route("/logout").post(isAuthenticated, logout)

export default router;