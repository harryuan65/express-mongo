var express = require('express');
var router = express.Router();
const db = require("../../api/mongo/mongo");
// db.connect_mongo();

function router_log(str){
    console.log(`[Stocker]${str}`);
}

router.get('/',(req,res)=>{
    res.set('Content-Type', 'text/html');
    res.send("api");
});
router.get('/all',(req,res)=>{
    db.get_all("sheet").then(d=>{
        router_log("Received: ")
        router_log(d);
        res.json(JSON.stringify(d,null,2));
      })
});

router.get('/search',(req,res)=>{
    router_log("search params:");
    router_log(req.params);
    res.json(req.params);
    // db.search(req.param).then(d=>{
    //     router_log("Received: ")
    //     router_log(d);
    //     res.json(JSON.stringify(d,null,2));
    //   })
});
router.get('/drop',(req,res)=>{
    router_log("Dropping collection");

    result = false;
    if(req.query.collection) {
        router_log(`Dropping by query ${req.query.collection}`)
        db.drop_collection(req.query.collection);
    }
    if(req.params.collection){
        router_log(`Dropping by params ${req.params.collection}`)
        db.drop_collection(req.params.collection);
    }
    res.render('stocker/result',{message:`Dropped ${req.query.collection}`})
});

router.post('/insert',(req,res)=>{
    router_log(req.body);
})
module.exports = router;