// const a = 'abc';
// console.log(a);

// class ab{
//   constructor(){
//     this.b = 12;
//   }
  
//   test() {
//     console.log(this.b);
//   }
// }

// var c = new ab();
// c.test();
// // console.log(c.b);

// function test() {
//   this.a = 1;
//   this.f = funchange;
//   function funchange() {
//     console.log(a);
//   }
// }

// var d = new test();
// d.f();

// let str1 = "ab";
// let str2 = str1 + 123;
// console.log(str2);

// const fs = require('fs');
// const util = require('util');

// const read = util.promisify(fs.readFile);

// async function readfile(name){
//   try{
//     let data = await read(name);
//     console.log("111111 " + data);    
//   }catch(err){
//     console.log(err);
//   }
// }

// readfile("RADME.md");

// try{
//   if (!fs.existsSync('./log')){
//     fs.mkdirSync('./log');
//     if (!fs.existsSync('./log/app')){
//       fs.mkdirSync('./log/app');
//     }
//   }  
// }catch(e){
//   console.log(e);
// }


// var ab = {a:'ac',b:'bc'};
// for (cd in ab){
//   if (cd == "c"){
//     console.log("11");
//   }else if (cd == "a"){
//     console.log("222");
//   }else{
//     console.log("333");
//   }
// }

var a = "aa ";
a += "bb";
console.log(a);