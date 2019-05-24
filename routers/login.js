
const express = require('express');
const router = express.Router();

router.get('/',(req,res,next)=>{
  const phone = Number(req.query.phone);
  if (phone == NaN){
    res.json({user_state:"-1"}).end();
  }
  const password = req.query.password;
  
  debugf("the phone is ",phone," and the password is ",password);
  res.json({user_state:"1"}).end();
});

module.exports = router;