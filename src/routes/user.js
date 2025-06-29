const express = require("express");
const userAuth = require("../middlewares/auth");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

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
        res.status(400).send("Error: " + err.message);
    }
})

userRouter.get("/user/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        let limit = parseInt(req.query?.limit) || 4;
        const page = parseInt(req.query?.page) || 1;
        limit = limit > 30 ? 30 : limit;
        console.log(limit);
        const skipDocs = (page - 1) * limit;
        const data = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select(["fromUserId", "toUserId"]);

        const blockedUsersFromFeed = new Set();

        data.forEach(user => {
            blockedUsersFromFeed.add(user.fromUserId.toString());
            blockedUsersFromFeed.add(user.toUserId.toString());
        })

        const users = await User.find({
            $and: [
                {
                    _id: {
                        $not: {
                            $in: Array.from(blockedUsersFromFeed)
                        }
                    }
                },
                {
                    _id: {
                        $ne: loggedInUser._id
                    }
                }
            ]
        }).select([
            "firstName",
            "lastName"
        ]).sort({ "firstName": 1 }).skip(skipDocs).limit(limit);

        if (!users) {
            throw new Error("Either you have reacted to all the users on this platform or no user is present right now for you to react.")
        }

        res.json({
            message: "Users fetched successfully!",
            data: users
        });
    }
    catch (err) {
        res.status(400).send("Error: " + err.message);
    }
})

module.exports = userRouter;