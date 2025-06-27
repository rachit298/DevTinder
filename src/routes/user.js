const express = require("express");
const userAuth = require("../middlewares/auth");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");

const USER_SAFE_DATA = ["firstName", "lastName"];

// Get all the pending connection requests for the logged in user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const allPendingRequests = await ConnectionRequest.find({ toUserId: loggedInUser._id, status: "interested" }).populate('fromUserId', USER_SAFE_DATA);

        res.send({
            message: "Requests fetched successfully!",
            data: allPendingRequests
        })
    }
    catch (err) {
        res.status(400).send("Error: " + err.message);
    }
})

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        let data = await ConnectionRequest.find({
            $or:
                [
                    { toUserId: loggedInUser._id },
                    { fromUserId: loggedInUser._id }
                ],
            status: "accepted"
        })
            .populate("fromUserId", USER_SAFE_DATA)
            .populate("toUserId", USER_SAFE_DATA);

        data = data.map(item => {
            if (item.fromUserId.equals(loggedInUser._id)) {
                return item.toUserId;
            }
            return item.fromUserId;
        });

        res.json({
            message: "Connections fetched successfully!",
            data
        })
    }
    catch (err) {
        res.status(400).send({ message: err.message });
    }
})

module.exports = userRouter;