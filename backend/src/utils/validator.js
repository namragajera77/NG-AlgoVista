const validator = require('validator');

const validate = (data) => {
    if (!data || typeof data !== 'object') {
        throw new Error('No data provided for validation');
    }

    const mandatoryFields = ['firstname', 'emailid', 'password'];
    const isAllowed = mandatoryFields.every((k) => Object.keys(data).includes(k));

    if (!isAllowed) {
        throw new Error('Mandatory fields are missing');
    }

    if (!validator.isEmail(data.emailid)) {
        throw new Error('Invalid email format');
    }

    // Simplified password rule: only require minLength of 8 characters
    if (data.password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
    }
};

module.exports = validate;
