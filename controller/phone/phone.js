
const gdata = require('../../models/data');
const rpc_request = require('../../models/http_request/rpc');

class Phone {
  constructor(){

  }

  async registerGetCaptcha(req,res,next){
    const phone_number = req.params.phone_number;
    if (phone_number.match(/[0-9]{11}/) == null){
      res.end({
        status: 100,
        message: 'phone number dont support.'
      });
      return;
    }
    ophone = await gdata.getPhoneInfo(phone_number);
    if (ophone.captcha_code != "" && (ophone.captcha_code_time.getTime() + 60000 < Date.now())){
      res.end({
        status: 102,
        message: 'please wait for the message.'
      });
      return;
    }
    let options = {
      hostname:'192.168.1.1',
      port:80,
      path:'/captcha',
      method:'GET'
    };
    let captcha = await rpc_request(options,false);
    if (captcha == null){
      res.end({
        status: 101,
        message: 'can\'t get the captcha.'
      });
      return;
    }else{
      ophone.updateOne(
        {phone_number:ophone.phone_number},
        {captcha_code:captcha,captcha_code_time:new Date()},
        (err,result)=>{
          if (err) debugf(err);
          else debugf("get the captcha:",captcha)
        }
        );
      res.end({
        status: 201,
        message: 'get captcha succeed.'
      });
      return;
    }
  }
}


module.exports = new Phone();