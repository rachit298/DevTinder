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

const validateEditProfileData = (req) => {
    const userDetailsToUpdate = req.body;
    const ALLOWED_FIELDS = ["firstName", "lastName", "age", "about", "gender"];
    const areFieldsValid = Object.keys(userDetailsToUpdate).every((field) => ALLOWED_FIELDS.includes(field));

    if (!areFieldsValid) {
        throw new Error("Invalid edit request.");
    }

    return areFieldsValid;
}

module.exports = { validateSignUpData, validateEditProfileData };