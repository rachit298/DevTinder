const { mongoose } = require("mongoose");
const { Schema } = mongoose;
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

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
    },
    age: {
        type: Number,
        min: 18,
        default: 18,
        max: 130
    },
    gender: {
        type: String,
        validate: (value) => {
            if (!['male', 'female', 'other'].includes(value)) {
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

// custom validation methods (don't use arrow function)
userSchema.methods.getJWT = async function () {
    const user = this;

    // created a token using JWT package
    const token = await jwt.sign({ _id: user._id }, "N0d#.J$", { expiresIn: '8h' });

    return token;
}

userSchema.methods.validatePassword = async function (userInputPassword) {
    const user = this;
    const passwordHash = user.password;
    
    // compare user input password with hash password stored in DB
    const isPasswordMatched = await bcrypt.compare(userInputPassword, passwordHash);

    return isPasswordMatched;
}

// An instance of a model is called a document. 
// Models are responsible for creating and reading documents from the underlying MongoDB database.
const User = mongoose.model('User', userSchema);

module.exports = User;