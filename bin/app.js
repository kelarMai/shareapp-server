
const fs = require('fs');
const express = require('express');
const util = require('util');

require('../public/log4js');
const router_index = require('../routers/index');

global.gConfig = null;


async function readConfig(){
  try{
    // const read = util.promisify(fs.readFile);
    // let data = await read('./config/app.json');
    let data = fs.readFileSync('./config/app.json');
    let config = data.toString();
    if (config == '') return;
    gConfig = await JSON.parse(config);
  }catch(err){
    debugf(err);
    process.exit(1);
  }
}

async function initServer(){
  const mysql_server =  require('../models/mysql/mysql');
  global.gSql = new mysql_server(gConfig.mysql,"./models/mysql/sqltable.json");

  // const redis_server = require('../public/redis');
  // global.gRedis = new redis_server(gConfig.redis);

  var mongoose = require('../models/mongoose/mongoose');
  mongoose(gConfig.mongoose.url);
}

function main() {
  const app = express();

  app.use(Log4js.connectLogger(Log4js.getLogger("appdebugf"),{'format': ':method :url'}));

  app.use("/shareapp",router_index);

  app.listen(gConfig.app_server.port,() =>{
    debugf("startd the server in port:",gConfig.app_server.port);
  });
}

async function run() {
  try {
    await readConfig();
    debugf("app in run ",gConfig);
    await initServer();
  }catch(err){
    debugf(err);
  }
  main();
}


run();
