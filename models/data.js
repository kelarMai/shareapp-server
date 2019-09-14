
const mongo_phone_account_model = require('./mongoose/mongo_phone_account_model');


class Data {
  
  async getPhoneInfo(phone_number){
    var phone_info = mongo_phone_account_model.findOne({phone_number:phone_number}).exec((err,res)=>{
      if (err){
        debugf(`can\'t get the phone(${phone_number}) info in mongoose`);
      }
      else{
        return phone_info;
      }
    });
    var phone_info = gSql.query(`select * from phone where phone_number = ${phone_number}`);
    if (phone_info == null || phone_info.length == 0){
      debugf(`can\'t get the phone(${phone_number}) info in mysql`);
    }else{
      
      return phone_info[0];
    }
  }
}