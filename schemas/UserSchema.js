const {Schema} = require('mongoose');


const UserSchema = new Schema({
    name: String,
    mobileNumber: Number,
    password: String,
});
module.exports = {UserSchema};

