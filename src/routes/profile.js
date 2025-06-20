const express = require("express");
const profileRouter = express.Router();
const userAuth = require('../middlewares/auth');
const { validateEditProfileData } = require("../helper/validation");
const bcrypt = require('bcrypt');

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        res.send(req.user);
    }
    catch (err) {
        res.status(404).send("Error while fetching the user.\n Error message: " + err.message);
    }
})

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        validateEditProfileData(req);
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) => loggedInUser[key] = req.body[key]);

        // save() will by default check validations given in schema level and only modifies those fields which have different data
        await loggedInUser.save();
        res.send("User details updated successfully.");
    }
    catch (err) {
        res.status(404).send("Error while updating user details.\n Error message: " + err.message);
    }
})

profileRouter.patch("/profile/forgot-password", userAuth, async (req, res) => {
    try {
        const user = req.user;
        const { currentPassword, newPassword } = req.body;
        const isPasswordMatched = await user.validatePassword(currentPassword);

        if (!isPasswordMatched) {
            throw new Error("Password didn't match.");
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.send("Password changed successfully.");
    }
    catch (err) {
        res.status(404).send("Error while updating user password.\n Error message: " + err.message);
    }
})

module.exports = profileRouter;