var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')
const db = require("../api/mongo/mongo");
const tools = require('../api/middleware/route_utils');
db.connect_mongo("stocker_router");

function router_log(str){
    console.log(`[Stocker]${str}`);
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
   db.list_collections().then(ret=>{
       router_log("All collections:");
       ret.map(d=>{
        router_log(JSON.stringify(d));
       })
       res.render('stocker/result',{status: true,message:`All collections as below`, data:`${JSON.stringify(ret.map(d=>{
           return d.idIndex.ns;
       }))}`});
   })
});
router.get('/create_home',(req,res)=>{
   res.render('stocker/create_home',{subtitle:"Create Collection"});
})
router.post('/create_collection',(req,res)=>{
    db.createCollection(req.body.collection)
    .then(ret=>{
        var msg = 'Created Collection => [name:'+JSON.stringify(ret.s.namespace.collection)+", id:"+JSON.stringify(ret.s.pkFactory.index)+", db:"+JSON.stringify(ret.s.namespace.db)+"]";
        router_log(msg);
        res.render('stocker/result',{status:true,message:`Created ${req.body.collection}`,data: msg });
    })
    .catch(err=>{
        res.render('stocker/result',{status:false,message:"Error",data:`${err}`});
    })
});

router.get('/drop_home',tools.info,(req,res)=>{
    res.render('stocker/drop_home',{subtitle:"Drop Home"});
})
router.post('/drop',tools.info,(req,res)=>{
    result = false;
    var name = '';
    if(req.query.collection) {
        router_log(`Dropping by query ${req.query.collection}`)
        db.dropCollection(req.query.collection);
        name = req.query.collection;
    }
    if(req.body.collection){
        var collection = req.body.collection;

        db.dropCollection(collection)
        .then(ret=>{
           router_log(`Dropped by body(collection name: ${req.body.collection})`)
           res.render('stocker/result',{status:true,message:`Dropped collection \'${collection}\'`})
        })
        .catch(err=>{
           router_log(`${err}`)
           res.render('stocker/result',{status:false, message:`Failed to drop collection \'${collection}\'`,data:`${err}`});
        })
        name = req.body.collection;
    }
});

router.get('/all',tools.info,(req,res)=>{
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

router.post('/search',tools.info,(req,res)=>{
    if(!req.body.collection){
        res.render("stocker/result",{status:false, message:"Collection required"});
    }

    if(req.body){
      db.where(tools.packdata(req.body))
      .then(ret=>{
        //   res.json(ret);
         console.log(ret);
         res.render("stocker/result",{status:true,message:"Found",data: (JSON.stringify(ret))});
        })
        .catch(err=>{
            // res.json(err);
            res.render("stocker/result",{status:false,message:"Error",data: err});
        })
    }else{
        res.render("stocker/result",{status:false, message:"Search keywords required"});
    }
})

router.get('/insert_home',tools.info,(req,res)=>{
    res.render('stocker/insert_home',{subtitle:"Insert Home"});
})
router.post('/insert',tools.info,(req,res)=>{
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






module.exports = router;