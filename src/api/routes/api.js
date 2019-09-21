var express = require('express');
var router = express.Router();
const db = require("../mongo/main");
db.connect_mongo();

router.get('/',(req,res)=>{
    res.set('Content-Type', 'text/html');
    db.get_all().then(d=>{
      console.log("Received: ")
      console.log(d);
      res.json(JSON.stringify(d,null,2));
    })
});
router.get('/search',(req,res)=>{
    console.log("search params:");
    console.log(req.params);
    res.json(req.params);
    // db.search(req.param).then(d=>{
    //     console.log("Received: ")
    //     console.log(d);
    //     res.json(JSON.stringify(d,null,2));
    //   })
});
router.get('/drop',(req,res)=>{
    console.log("Dropping collection");
    console.log(req.params);
    db.drop_collection(req.query.collection);
});

router.post('/insert',(req,res)=>{
    console.log(req.body);
})
module.exports = router;