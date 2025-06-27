const mongoose = require("mongoose");
const { Schema } = mongoose;

const connectionRequestSchema = new Schema({
    fromUserId: {
        type: Schema.Types.ObjectId,
        ref: "User", // reference to the User collection
        required: true
    },
    toUserId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ["ignore", "interested", "accepted", "rejected"],
            message: `'{VALUE}' is incorrect status type`
        },
        required: true
    }
}, { timestamps: true });

// creating compound indexes to make query/queries quicker
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

// this validation of making sure that user is not sending request to itself can be in API function also.
connectionRequestSchema.pre("save", function (next) {
    const connectionRequest = this;

    // check if fromUserId is same as toUserId
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send connection request to itself.");
    }
    next();
})

const ConnectionRequest = mongoose.model("connectionRequest", connectionRequestSchema);

module.exports = ConnectionRequest;