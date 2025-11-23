import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import connectDB from './db/database.js';
import userRouter from "./routes/user.js";
import todoRouter from "./routes/todo.js";

const app = express();
dotenv.config();

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration
const allowedOrigins = process.env.CLIENT_URL 
  ? process.env.CLIENT_URL.split(',')
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(null, true); // Allow all for now
        }
    },
    credentials: true
}));

// API Routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/todo', todoRouter);

// Database connection
connectDB();

// Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log("listening on port -> ", PORT);
});