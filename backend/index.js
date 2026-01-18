import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import cookieParser from 'cookie-parser';
import { connectDB } from './utils/db.js';
import authRoute from "./routes/authRoutes.js"

dotenv.config({});

const app = express()
const PORT = process.env.PORT
app.use(cors(
  {origin: 'http://localhost:5173', 
    credentials: true
  }
));

app.use(cookieParser())
app.use(express.json())


// api's
app.use("/auth", authRoute)



app.listen(PORT, () => {
    connectDB()
    console.log(`Server is running on port ${PORT}`);
})


