
const mongoose = require('mongoose');

mongoose.connect(gConfig.mongoose.url,{useNewUrlParser:true});

var db = mongoose.connection;

db.on('error',()=>{
    debugf('mongoose connection error');
});
db.on('open',()=>{
    debugf('monogoose connection open');
});
db.on('close',()=>{
    debugf('monogoose close the connection');
});


module.exports = db;