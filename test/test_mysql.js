
const mysql = require('mysql');

var client = mysql.createConnection({
  host : 'localhost',
  user:'root',
  password:'123',
  database:'shareapp'
});
client.connect();
client.query('select * from test',(err,data,fields)=>{
  if (err) 
    console.log(err);
  else{
    // console.log(fields);
    for (let i = 0; i < data.length;i++){
      console.log(data[i].sn, " ", data[i].name);
    }
  }
});