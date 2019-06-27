
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Test');

const test = new mongoose.Schema({
    updateAt : {
        type:Date,
        default:new Date
    }
});

var testObject = mongoose.model('test_time',test);
testObject.create({},(err,doc)=>{
    if (err) console.log(err);
    console.log(doc.updateAt.getTime());
});
