const mongoose = require("mongoose");

const connectDB = async () => {
    //connected to cluster(collection of Databases)
    await mongoose.connect("mongodb+srv://username:password@clustername.6meuyxz.mongodb.net/devTinder");
}

module.exports = {
    connectDB
}
