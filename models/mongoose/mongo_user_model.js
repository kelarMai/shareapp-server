
const mongoose = require('mongoose');

const user_scheme = new mongoose.Schema({
    user_name: String,
    session_id: Number,
    phone_number: String,
    password:String
});

user_scheme.index({user_sn:1});
const User = mongoose.model('User',user_scheme);

module.exports = User;