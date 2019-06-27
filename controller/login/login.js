
class Login {
  constructor(){
    this.phone_number = null;
    this.passwrod = null;
  }

  async userLogin(req,res,next) {
    const phone_number = Number(req.query.phone_number);
    if (phone_number == NaN){
        res.json({loginstate:"-1"}).end();
    }
    const password = req.query.password;
    
    debugf("the phone is ",phone_number," and the password is ",password);
    res.json({loginstate:"1"}).end();
  }
}

module.exports = new Login();