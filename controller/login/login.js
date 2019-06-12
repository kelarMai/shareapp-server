
class Login {
  constructor(){
    this.phone = null;
    this.passwrod = null;
  }

  async userLogin(req,res,next) {
    const phone = Number(req.query.phone);
    if (phone == NaN){
        res.json({loginstate:"-1"}).end();
    }
    const password = req.query.password;
    
    debugf("the phone is ",phone," and the password is ",password);
    res.json({loginstate:"1"}).end();
  }
}

module.exports = new Login();