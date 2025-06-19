const express = require("express");
const { connectDB } = require('./config/database');
const app = express();
const User = require("./models/user");
const validateSignUpData = require("./helper/validation");
const validator = require("validator");
const bcrypt = require("bcrypt");
const cookieParser = require('cookie-parser')
const userAuth = require('./middlewares/auth');

// first connect to DB. If connected successfully, then only listen to port
connectDB().then(() => {
    console.log("Database connection established.");
    app.listen(1234, () => {
        console.log("Server is listening on port 1234.");
    });
}).catch((err) => {
    console.log("Database cannot be connected.");
})

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
    try {
        // Validation of data
        validateSignUpData(req);

        // Encrypt the password
        let { firstName, lastName, emailId, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);

        // Creating a new instance of the User model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        });
        await user.save();
        res.send("User created successfully.");
    }
    catch (err) {
        res.status(400).send("Error while creating user. \n Error message => " + err.message);
    }
})

app.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        if (!validator.isEmail(emailId)) {
            throw new Error("Invalid email!");
        }
        const user = await User.findOne({ emailId });
        if (!user) {
            throw new Error("Invalid credentials.");
        }
        const isPasswordMatched = await user.validatePassword(password);
        if (!isPasswordMatched) {
            throw new Error("Invalid credentials.");
        };

        const token = await user.getJWT();

        // added token as a cookie in response
        res.cookie("token", token, {
            expires: new Date(Date.now() + 8 * 3600000)
        });

        res.send("Login successful!!!")
    }
    catch (err) {
        res.status(400).send("Error while logging in the user. \n Error message => " + err.message);
    }
})

app.get("/profile", userAuth, async (req, res) => {
    try {
        res.send(req.user);
    }
    catch (err) {
        res.status(404).send("Error while fetching the user.\n Error message: " + err.message);
    }
})

app.post("/sendConnReq", userAuth, (req, res) => {
    res.send("sent connection req");
})