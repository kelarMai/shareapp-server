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
// console.log(c.b);

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

// var a = "aa ";
// a += "bb";
// console.log(a);

// var a = "abcdefg";
// console.log(a,a.length);
// a = a.substring(0,a.length - 1);


// var a = [{a:"ab",b:"cd"},{a:"cd",b:"de"}];
// a = null;
// console.log(a);

// for (let t in a){
//   console.log(t);
  // console.log(a[t].a,a[t].b);
// }


//test bind
// this.x = 9;    // 在浏览器中，this指向全局的 "window" 对象
// var module1 = {
//   x: 81,
//   getX: function() { return this.x; }
// };

// console.log(module1.getX()); // 81

// var retrieveX = module1.getX;
// console.log(retrieveX());   
// // 返回9 - 因为函数是在全局作用域中调用的

// // 创建一个新函数，把 'this' 绑定到 module 对象
// // 新手可能会将全局变量 x 与 module 的属性 x 混淆
// var boundGetX = retrieveX.bind(module1);
// console.log(boundGetX()); // 81