const validator = require("validator");

const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error("Name is not valid!");
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error("Password is invalid.\n Please follow below requirements to create a strong password: \n Length: 8, Minimum lowercase character: 1, Minimum uppercase character: 1, Minimum digits: 1, Minimum number of special characters: 1");
    }
}

module.exports = validateSignUpData;