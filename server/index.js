const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const { errorMiddleware } = require("./middlewares/error")
const connectDB = require("./config/db")
require("dotenv").config();

const app = express();

app.use(express.json())
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cookieParser())

connectDB();

const authRouter = require("./routes/Auth")
const userRouter = require("./routes/User")
const chatRouter = require("./routes/Chat")
const tokenRouter = require("./routes/Token")
const messageRouter = require("./routes/Message")

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/chat", chatRouter)
app.use("/api/token", tokenRouter)
app.use("/api/message", messageRouter)

//middleware for error
app.use(errorMiddleware)

app.get("/api", (req, res, next) => {
    return res.status(200).send(`Server is running`)
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Listening to PORT : ${PORT}`)
})