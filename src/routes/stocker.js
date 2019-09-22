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
function packdata(params){
    var collection = params.collection;
    delete params.collection;
    return {
        collection:collection,
        data: params
    };
}
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.use(express.static('public/'));//有這一行才吃的到CSS link href=""

router.use('/api',require('./api/stocker_api'));

router.get('/',(req,res)=>{
    res.set('Content-Type', 'text/html');
    res.render("stocker/index",{subtitle:"Home"});
});

router.get('/list_collections',(req,res)=>{
   db.list_collections().then(d=>{
       router_log("All collections:");
       router_log(JSON.stringify(d));
       res.render('stocker/result',{status: true,message:`All collections as below`,data:`${JSON.stringify(d)}`});
   })
})
router.get('/all',info,(req,res)=>{
    var collection = "sheet";
    db.get_all(collection).then(d=>{
        router_log("Received: ")
        router_log(JSON.stringify(d));
        res.render('stocker/result',{status: true,message:`Collection: ${collection}`,data:`${JSON.stringify(d)}`})
      })
});

router.get('/search_home',(req,res)=>{
    res.render("stocker/search_home",{subtitle:"Search Home"});
});

router.post('/search',info,(req,res)=>{
    if(!req.body.collection){
        res.render("stocker/result",{status:false, message:"Collection required"});
    }

    if(req.body){
      db.where(packdata(req.body))
      .then(ret=>{
        //   res.json(ret);
        //  console.log(ret);
         res.render("stocker/result",{status:ret.result.ok,message:"Found",data: (JSON.stringify(ret))});
        })
        .catch(err=>{
            // res.json(err);
        })
    }else{
        res.render("stocker/result",{status:false, message:"Search keywords required"});
    }
})

router.get('/insert_home',info,(req,res)=>{
    res.render('stocker/insert_home',{subtitle:"Insert Home"});
})
router.post('/insert',info,(req,res)=>{
    var insert_payload = packdata(req.body);
    db.insert(insert_payload)
       .then(ret=>{
        console.log(ret.ops);
       res.render('stocker/result',{status:true, message:`Insert into collection \'${insert_payload.collection}\'`,data:`${JSON.stringify(ret.ops)}`});
    })
       .catch(err=>{
           console.log(`Error: ${err}`)
        res.render('stocker/result',{status:false,message: `Error: ${err}`})
    })
})



router.get('/drop_home',info,(req,res)=>{
    res.render('stocker/drop_home',{subtitle:"Drop Home"});
})
router.post('/drop',info,(req,res)=>{
    result = false;
    var name = '';
    if(req.query.collection) {
        router_log(`Dropping by query ${req.query.collection}`)
        db.drop_collection(req.query.collection);
        name = req.query.collection;
    }
    if(req.body.collection){
        router_log(`Dropping by body(collection name: ${req.body.collection})`)
        db.drop_collection(req.body.collection);
        name = req.body.collection;
    }
    res.render('stocker/result',{message:`Dropped collection \'${name}\'`})
});


module.exports = router;