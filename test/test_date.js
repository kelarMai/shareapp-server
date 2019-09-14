
var t1 = new Date();
console.log(t1); //2019-09-12T03:30:13.862Z
var t2 = t1.getSeconds();
console.log(t2); //13
t2 = t1.getTime();
console.log(t2); //1568259121117  // millisecond level
t2 = Date.now();
console.log(t2); //1568259121121  //more eplict
t2 = t1.getUTCSeconds();
console.log(t2); //13
t2 = t1.getUTCMilliseconds();
console.log(t2); //862

// translate 
t2 = t1.getTime();
var t3 = new Date(t2);
console.log(t3); // 2019-09-12T03:30:13.862Z
var t3 = t2.toString();
console.log(t3);

//use the server run time in millisecond for the interval calculate
t2 = process.uptime();
console.log(t2); //0.024966876

