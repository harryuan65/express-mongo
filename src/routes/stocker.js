var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')
const db = require("../api/mongo/mongo");
db.connect_mongo();

function router_log(str){
    console.log(`[Stocker]${str}`);
}

function info(req,res,next){
    console.log("Path: "+req.path);
    console.log("Body: ");
    console.log(req.body);
    next();
}

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.use(express.static('public/'));//有這一行才吃的到CSS link href=""

router.use('/api',require('./api/stocker_api'));

router.get('/',(req,res)=>{
    res.set('Content-Type', 'text/html');
    res.render("stocker/index",{subtitle:"Home"});
});

router.get('/search_home',(req,res)=>{
    res.render("stocker/search_home",{subtitle:"Search Home"});
});
router.post('/search_home',info,(req,res)=>{
    var result = null;
    var data = null;
    if(req.params){
        result = true;
        data = JSON.stringify(req.body);
    }
    else{
        result = false;
        data = "Nothing found";
    }
    res.render("stocker/result",{status:result,message:data});
})
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