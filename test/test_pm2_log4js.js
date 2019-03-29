
const http = require('http');

//test the pm2 + log4js if this can write right.
for (let i = 0;i < 1; i++){
  http.get('http://127.0.0.1:3000/login/' + i,(res)=>{
    res.on('data',(chunk) =>{
      console.log("222 " + chunk);
    });
    
    res.on('end',()=>{});

  }).on('error',(e) => {
    console.error('something wrong for connect ' + e.message);
  })
}

