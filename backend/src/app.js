import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import morgan from "morgan"


dotenv.config({
    path: './.env'
})

const app = express();

app.use(cors({
    credentials: true,
    origin: process.env.CORS_ORIGIN
}))
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(morgan());

// import router 
import userRouter from "./routes/user.routes.js"

app.use('/api/v1/users', userRouter)

export { app }