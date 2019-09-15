
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Test',{ useNewUrlParser: true });

const test = new mongoose.Schema({
    name : String,
    updateAt : {
        type:Date,
        default:new Date
    }
});

var testObject = mongoose.model('test_time',test);
testObject.create({name:"name"},(err,doc)=>{
    if (err) console.log(err);
    console.log(doc.updateAt.getTime());
});

async function testing(){
    var otest = await testObject.findOne({},(err,result)=>{
        if(err) console.log(err);
        else console.log(result);
    });
    var otest2 = new testObject({name:"second"},(err,doc)=>{
        if (err) console.log(err);
    });
    var otest3 = await otest2.save();
    console.log(otest3);
}
testing();
