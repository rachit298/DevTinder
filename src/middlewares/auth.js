const jwt = require('jsonwebtoken');
const User = require("../models/user");

// middleware for checking token for other APIs except signup and login
const userAuth = async (req, res, next) => {
    try {
        // Read the token from the req cookies
        const { token } = req.cookies;
        // validate the token 
        if (!token) {
            throw new Error("Invalid Token.");
        }

        // get "_id" from token
        const decodedMsg = await jwt.verify(token, "N0d#.J$");

        // find the user
        const { _id } = decodedMsg;
        const user = await User.findOne({ _id });
        if (!user) {
            throw new Error("User not present.");
        }
        req.user = user;
        next();
    }
    catch (err) {
        res.status(404).send("Error: " + err.message);
    }
}

module.exports = userAuth;