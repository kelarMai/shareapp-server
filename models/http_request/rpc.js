
const http = require('http');
const https = require('https');

function promise_req(options){
  const new_request = options.port == 443 ? https : http;

  return new Promise((resolve,reject)=>{
    // return a promise object
    const req = new_request.request(options,(res)=>{
      let ret = "";
      res.on('data',(buffer)=>{ret += buffer.toString() });
      res.on('end',()=>{
        JSON.parse(ret);
        resolve(ret);
      });
    });

    req.on('error',(err)=>{debugf(`promise_req get something wrong: ${err.message}`)});
    req.end();
  });
}

async function real_rpc(options){
  console.log('rpc.js real_rpc location01');
  let response = await promise_req(options);
  return response;
}

function fake_rpc(options){
  console.log('rpc.js fake_rpc location01');
  if (path == '/captcha'){
    let fake_code = 'ab12';
    debugf('rpc.js/fake_rpc ',fake_code);
    return fake_code;
  }
}

var rpc = function(options,test){
  if (test){
    return real_rpc(options);
  }else{
    return fake_rpc(options);
  }
}

module.exports = rpc;