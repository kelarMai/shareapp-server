
const mongoose = require('mongoose');

const phone_account = new mongoose.Schema({
    phone_number:{
        type:String,
        required:true,
    },
    verification_code:String,
    verification_code_time:{
        type:Date,
        default:new Date
    },
    associated_account:[String]
});

phone_account.index({phone_number:1});
const Phone = mongoose.model('Phone',phone_account);

module.exports = Phone;

