const express = require("express");
const { connectDB } = require('./config/database');
const app = express();
const cookieParser = require('cookie-parser');
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// first connect to DB. If connected successfully, then only listen to port
connectDB().then(() => {
    console.log("Database connection established.");
    app.listen(1234, () => {
        console.log("Server is listening on port 1234.");
    });
}).catch((err) => {
    console.log("Error while establishing connection with database.");
})
