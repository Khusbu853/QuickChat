import express from "express";
import { getAllContacts, getContactsForDMList, searchContacts } from "../controllers/contactController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/search").post(isAuthenticated, searchContacts);
router.route("/getDmContacts").get(isAuthenticated, getContactsForDMList);
router.route("/get-all-contacts").get(isAuthenticated, getAllContacts);

export default router;