const express = require("express");
const requestRouter = express.Router();
const userAuth = require('../middlewares/auth');
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

requestRouter.post("/request/send/:status/:toUserId/", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const { toUserId, status } = req.params;

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

        // status validation
        const allowedStatus = ["interested", "ignore"];
        const isStatusValid = allowedStatus.includes(status);
        if (!isStatusValid) {
            throw new Error("Status not valid!");
        }

        const toUser = await User.findById({ _id: toUserId });
        if (!toUser) {
            return res.status(400).json({
                message: "Your chosen user doesn't exist."
            });
        }

        // check if there is any existing connection request between either user
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                {
                    fromUserId,
                    toUserId
                },
                {
                    fromUserId: toUserId,
                    toUserId: fromUserId
                }
            ]
        });

        if (existingConnectionRequest) {
            return res.status(400).json({
                message: "Connection request already exist."
            });
        }

        const data = await connectionRequest.save();
        res.json({
            message: `You ${status === "interested" ? "showed interest in" : "ignored"} ${toUser.firstName} ${toUser.lastName}.`,
            data
        })
    }
    catch (err) {
        res.status(400).send("Error while updating your choice.\nError message: " + err.message
        );
    }
})

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const allowedStatus = ["accepted", "rejected"];
        const { status, requestId } = req.params;

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Status not valid." });
        }

        const connectionRequest = await ConnectionRequest.findOne({ _id: requestId, toUserId: loggedInUser._id, status: "interested" });

        if (!connectionRequest) {
            return res.status(404).json({
                message: "Connection request not found."
            });
        }
        connectionRequest.status = status;
        const data = await connectionRequest.save();

        res.json({
            message: `Connection request ${status}.`,
            data
        })
    }
    catch (err){
        res.status(400).send("Error: " + err.message);
    }
})

module.exports = requestRouter;