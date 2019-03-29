#!/usr/bin/env node

var log4js = require('log4js');
log4js.configure('./config/log4js.json');

var debug_info = log4js.getLogger("appdebugi");
var debug_file = log4js.getLogger("appdebugf");
var debug_console =log4js.getLogger();

function setapp(type){
  if (type == 1){
    // mysqlapp
    debug_info = log4js.getLogger("mysqldebugi");
    debug_file = log4js.getLogger("mysqldebugf");
  }else{}
}


function dinfo(...args) {
  debug_info.info(args);
}
function dfile(...args){
  debug_file.debug(args);
}
function dconsole(...args){
  debug_console.debug(args);
}
function log_shutdown(){
  log4js.shutdown();
}

global.Log4jsSetappType = setapp;
global.debugi = dinfo;
global.debugf = dfile;
global.debugc = dconsole;
global.Log4js = log4js;

module.exports = {
  // setapp: setapp,
  // debugi: dinfo,
  // debugf: dfile,
  // debugc: dconsole,
  // log4js: log4js
};