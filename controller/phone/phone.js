
const gdata = require('../../models/data');
const rpc_request = require('../../models/http_request/rpc');

class Phone {
  constructor(){

  }

  async registerGetCaptcha(req,res,next){
    const phone_number = req.params.phone_number;
    
    let options = {
      hostname:'192.168.1.1',
      port:80,
      path:'/captcha',
      method:'GET'
    };
    let captcha = await rpc_request(options,true);
    if (captcha == null){
      res.end({
        status: 0,
        message: 'can\'t get the captcha.'
      });
      return;
    }else{

      res.end({
        status: 1,
        message: 'get captcha succeed.'
      });
      return;
    }
  }
}