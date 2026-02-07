import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import http from 'http';
import cookieParser from 'cookie-parser';
import { connectDB } from './utils/db.js';
import authRoute from "./routes/authRoutes.js"
import contactRoute from "./routes/contactRoutes.js"
import messagesRoute from "./routes/messagesRoutes.js"
import channelRoute from "./routes/channelRoutes.js"
import setupSocket from './socket.js';

dotenv.config({});

const app = express()
const PORT = process.env.PORT
app.use(cors(
  {origin: process.env.ORIGIN, 
    credentials: true
  }
));

app.use(cookieParser())
app.use(express.json())


// api's
app.use("/auth", authRoute)
app.use("/contacts", contactRoute)
app.use("/messages", messagesRoute)
app.use("/channel", channelRoute)

const server = http.createServer(app);
setupSocket(server);


connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
}) .catch((error) => { 
  console.log("Failed to connect to database", error);
});


