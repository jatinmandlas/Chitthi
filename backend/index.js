import { configDotenv } from "dotenv"
configDotenv(); 
import express from "express"
import connectDb from "./config/db.js"
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import cors from "cors"
import { app, server } from "./socket/socket.js"
import userRouter from "./routes/user.routes.js"
import messageRouter from "./routes/message.routes.js"

const port=process.env.PORT ||5000

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use("/api/message",messageRouter)

server.listen(port,()=>{
    connectDb()
    console.log("server started")
})