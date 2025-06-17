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

app.use(express.json());

app.post("/signup", async (req, res) => {
    // Creating a new instance of the User model
    const user = new User(req.body);
    try {
        await user.save();
        res.send("User created successfully.");
    }
    catch (err) {
        res.status(400).send("Error while creating user. Error message => " + err.message);
    }
})

app.get("/feed", async (req, res) => {
    const dataObj = req.body;
    try {
        const users = await User.find(dataObj);
        if (users.length === 0) res.status(404).send("Users not found.");
        else {
            console.log("Users found successfully.");
            res.send(users);
        }
    }
    catch (err) {
        res.status(404).send("User not found.");
    }
})

app.get("/user", async (req, res) => {
    try {
        const user = await User.findOne({ "emailId": req.body.emailId });
        if (user === null) res.status(404).send("User not found.");
        else {
            console.log("User found successfully.");
            res.send(user);
        }
    }
    catch (err) {
        res.status(404).send("Error while searching the user.");
    }
})

app.delete("/user", async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findByIdAndDelete(id);
        if (user === null) res.status(404).send("User not found.");
        else {
            console.log("User deleted successfully.");
            res.send(user);
        }
    }
    catch (err) {
        res.status(404).send("Can't delete user.");
    }
})

app.patch("/user/:userId", async (req, res) => {
    const userId = req.params.userId;
    const dataObj = req.body;
    try {
        const ALLOWED_UPDATE = [
            "firstName",
            "lastName",
            "about",
            "password",
            "age"
        ];

        const isUpdateAllowed = Object.keys(dataObj).every((ele) =>
            ALLOWED_UPDATE.includes(ele)
        )
        console.log(isUpdateAllowed,
            dataObj
        );
        if (!isUpdateAllowed) {
            throw new Error("Update not allowed.");
        }
        const user = await User.findByIdAndUpdate(userId, dataObj, { returnDocument: 'after', runValidators: true });
        if (user.length === 0) res.status(404).send("User not found.");
        console.log("User updated successfully.");
        res.send(user);
    }
    catch (err) {
        res.status(404).send("Can't update user.");
    }
})