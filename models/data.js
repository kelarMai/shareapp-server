
const mongo_phone_account_model = require('./mongoose/mongo_phone_account_model');


class Data {
  
  async getPhoneInfo(phone_number){
    var phone_info = mongo_phone_account_model.findOne({phone_number:phone_number}).exec((err,res)=>{
      if (err){
        debugf(`can\'t get the phone(${phone_number}) info from mongoose`);
      }
      else{
        return phone_info;
      }
    });
    
    phone_info = gSql.query(`select * from phone where phone_number = ${phone_number};`);
    let new_phone_account = {
      phone_number : phone_number
    };

    if (phone_info.length == 0){
      debugf(`can\'t get the phone(${phone_number}) info in mysql`);
    }else{
      phone_info = phone_info[0];
      if (phone_info.captcha_code != ""){
        new_phone_account.captcha_code = phone_info.captcha_code;
        new_phone_account.captcha_code_time = new Date(phone_info.captcha_code_time || 0);
      }
      if (phone_info.associated_account != ""){
        new_phone_account.associated_account = phone_info.associated_account;
      }
    }

    new_phone_account = new mongo_phone_account_model(new_phone_account);
    return await new_phone_account.save();
  }
}

module.exports = new Data();