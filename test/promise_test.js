
function testing() {
  return new Promise((resolve, reject)=>{
    console.log("testing");
    setTimeout(() => {
      resolve(123);
    },1000);
  })
}

testing().then((result1) => {
  console.log("then1 " + result1);
  return 321;
}).catch((err) => {
  console.log("err " + err);
}).then((result2) => {
  console.log("then2 " + result2);
});


async function new_fun() {
  await testing();
  console.log("after");
}

new_fun();