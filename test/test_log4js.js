
var a = require('../public/log4js');

function testing(){
  // Log4jsSetappType(1);
  debugi("output to the info file");
  debugf("output to the debug file");
  debugc("output to the console");
}

module.exports = {
  testing
};

testing();