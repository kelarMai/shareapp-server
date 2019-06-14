
const mongoose = require('mongoose');


var mongoose_connection = null;

var db = function (url){
    if (mongoose_connection == null){
        if (url == null) {
            config = "mongodb://localhost:27017/shareapp";
        }
        mongoose.connect(url,{useNewUrlParser:true});
        mongoose_connection = mongoose.connection;
    }
    mongoose_connection.on('error',()=>{
        debugf('mongoose connection error');
    });
    mongoose_connection.on('open',()=>{
        debugf('monogoose connection open');
    });
    mongoose_connection.on('close',()=>{
        debugf('monogoose close the connection');
    });

    return mongoose_connection;
};

module.exports = db;