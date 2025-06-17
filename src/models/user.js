const { mongoose } = require("mongoose");
const { Schema } = mongoose;
const validator = require('validator');

// Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.
const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        maxLength: 20,
        trim: true
    },
    lastName: {
        type: String,
        maxLength: 20,
        trim: true
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        maxLength: 20,
        validate: (value) => {
            if (!validator.isEmail(value))
                throw new Error("Invalid email: " + value);
        }
    },
    password: {
        type: String,
        required: true,
        maxLength: 20
    },
    age: {
        type: Number,
        min: 18,
        default: 18,
        maxLength: 3
    },
    gender: {
        type: String,
        validate: (value) => {
            if (!['male', 'female', 'others'].includes(value)) {
                throw new Error("Gender data not valid.");
            }
        }
    },
    about: {
        type: String,
        default: "This is default about statement.",
        maxLength: 100
    }
},
    { timestamps: true });

// An instance of a model is called a document. 
// Models are responsible for creating and reading documents from the underlying MongoDB database.
const User = mongoose.model('User', userSchema);

module.exports = User;