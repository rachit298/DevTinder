const { mongoose } = require("mongoose");
const { Schema } = mongoose;

// Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.
const userSchema = new Schema({
    firstName: String,
    lastName: String,
    emailId: String,
    password: String,
    age: Number,
    gender: String
})

// An instance of a model is called a document. 
// Models are responsible for creating and reading documents from the underlying MongoDB database.
const User = mongoose.model('User', userSchema);

module.exports = User;