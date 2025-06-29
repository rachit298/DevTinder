const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../helper/validation");
const validator = require("validator");
const User = require("../models/user");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
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

authRouter.post("/logout", async (req, res) => {
    try {
        res.cookie("token", null, {
            expires: new Date(Date.now())
        });
        res.send("Logged out successfully!");
    }
    catch (err) {
        res.status(400).send("Error while logging out the user. \n Error message => " + err.message);
    }
})

module.exports = authRouter;