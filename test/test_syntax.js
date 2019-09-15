"use strict";

// // test the let use
// function testing(){
//   for (let i = 0;i < 10 ;i++)  
//   console.log(i);
// }

// // test the re
// function testing(){
//   var str = '123456789';
//   var str2 = '12345678925';
//   var new_str = str.match(/[0-9]{11}/);
//   console.log(new_str);
//   new_str = str2.match(/[0-9]{11}/);
//   console.log(new_str);
// }

// test the ""
function testing(){
  if (""){
    console.log("123");
  }else{
    // will use this one.
    console.log("456");
  }
  var a = "" || "123";
  console.log(a); // a = 123;
}

testing();

