const mongoose = require("mongoose");

const connectDB = async () => {
    //connected to cluster(collection of Databases)
    await mongoose.connect("mongodb+srv://rachit298:CPwSRVxl6cfkaDDC@namastenodejs.6meuyxz.mongodb.net/devTinder");
}

module.exports = {
    connectDB
}