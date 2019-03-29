
const fs = require('fs');
const express = require('express');
const util = require('util');

require('../public/log4js');
const router_index = require('../routers/index');


async function readConfig(){
  try{
    // const read = util.promisify(fs.readFile);
    // let data = await read('./config/app.json');
    let data = fs.readFileSync('./config/app.json');
    let config = data.toString();
    if (config == '') return;
    config = JSON.parse(config);
  }catch(err){
    debugc(err);
    process.exit(1);
  }
}

function main() {
  const app = express();
  app.use(Log4js.connectLogger(Log4js.getLogger("debugi"),{'format': ':method :url'}));
  
  router_index(app);

  app.listen(3000);  
}

async function run() {
  try {
    await readConfig();  
  }catch(e){
    debugc(err);
  }
  main();
}


run();
