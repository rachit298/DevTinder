const mongoose = require("mongoose");
const ENV = require("dotenv").config();

const connectDB = async () => {
    //connected to cluster(collection of Databases)
    await mongoose.connect(process.env.MONGODB_URI);
}

module.exports = {
    connectDB
}