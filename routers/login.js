
const express = require('express');
const router = express.Router();

router.use((req,res,next)=>{

  next(); 
})
router.get('/:id',(req,res,next)=>{
  res.end("something");
});

module.exports = router;