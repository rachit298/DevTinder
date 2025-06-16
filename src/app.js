const express = require("express");
const { connectDB } = require('./config/database');
const app = express();
const User = require("./models/user");

// first connect to DB. If connected successfully, then only listen to port
connectDB().then(() => {
    console.log("Database connection established.");
    app.listen(1234, () => {
        console.log("Server is listening on port 1234.");
    });
}).catch((err) => {
    console.log("Database cannot be connected.");
})

app.post("/signup", async (req, res) => {
    const userObj = {
        firstName: "Rachit",
        lastName: "S.",
        emailId: "rachit@sri.com",
        password: "rachit123"
    }
    // Creating a new instance of the User model
    const user = new User(userObj);
    try {
        await user.save();
        res.send("User created successfully.");
    }
    catch (err) {
        res.status(400).send("Error while creating user. Error message => " + err.message);
    }
})