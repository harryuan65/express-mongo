var express = require('express');
var router = express.Router();
const db = require("../mongo/connect");
db.connect_mongo();

router.get('/',(req,res)=>{
    res.set('Content-Type', 'text/html');
    db.get_all().then(d=>{
      console.log("Received: ")
      console.log(d);        
      res.json(JSON.stringify(d,null,2)); 
    })
});
router.get('/get_all',(req,res)=>{
    res.redirect('/login');
});

router.post('/insert',(req,res)=>{
    console.log(req.body);
})
module.exports = router;