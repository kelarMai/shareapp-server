// // connect the mysql and test alone
// const mysql = require('mysql');

// var client = mysql.createConnection({
//   host : 'localhost',
//   user:'root',
//   password:'123',
//   database:'shareapp'
// });
// client.connect();

const mysql_server =  require('../models/mysql/mysql');
var client = new mysql_server({},"../models/mysql/sqltable.json");

var phone_number = "123456789";
var captcha_code = "a1d5";
var captcha_code_time = Date.now();
var associated_account = "123";

client.query(`replace into phone 
              (phone_number,captcha_code,captcha_code_time,associated_account) 
              values (?,?,?,?);`,
              [phone_number,captcha_code,captcha_code_time,associated_account],
              (err,data,fields)=>{
                if (err) console.log(err);
                else{
                  console.log(data);
                  console.log(fields);
                }
              });
client.query(`replace into phone 
              (phone_number,captcha_code,captcha_code_time,associated_account) 
              values (?,?,?,?);`,
              ["","",0,"associated_account"],
              (err,data,fields)=>{
                if (err) console.log(err);
                else{
                  console.log(data);
                  console.log(fields);
                }
              });
// client.query(`select * from phone where phone_number = ${phone_number}`,(err,data,fields)=>{
client.query(`select * from phone ;`,(err,data,fields)=>{
  if (err) 
    console.log(err);
  else{
    console.log(data);
    for (let i = 0; i < data.length;i++){
      if (data[i].phone_number == ""){
        console.log(" not null and would be an empty string");
      }

      console.log(data[i]);
    }
  }
});