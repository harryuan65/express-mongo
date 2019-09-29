var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')
const db = require("../api/mongo/mongo");
const tools = require('../api/middleware/tools');
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

router.get('/list_home',(req,res)=>{
  res.render('stocker/list_home',{subtitle:"List Home"});
});

router.post('/list_collections',(req,res)=>{
   var db_name = req.body.db_name;
   db.list_collections(db_name).then(ret=>{
       router_log(`All collections in :${db_name}`);
       ret.map(d=>{
        router_log(JSON.stringify(d));
       })
       res.render('stocker/result',{status: true,message:`All collections in ${db_name}`, data:`${JSON.stringify(ret.map(d=>{
           return d.idIndex.ns;
       }))}`});
   })
});
router.get('/create_home',(req,res)=>{
   res.render('stocker/create_home',{subtitle:"Create Collection"});
})
router.post('/create_collection',(req,res)=>{
    var db_name = req.body.db_name;
    var collection_name = req.body.collection_name;
    db.createCollection(db_name,collection_name)
    .then(ret=>{
        var msg = 'Created Collection => [name:'+JSON.stringify(ret.s.namespace.collection)+", id:"+JSON.stringify(ret.s.pkFactory.index)+", db:"+JSON.stringify(ret.s.namespace.db)+"]";
        router_log(msg);
        res.render('stocker/result',{status:true,message:`Created ${collection_name} in DB:${db_name}`,data: msg });
    })
    .catch(err=>{
        res.render('stocker/result',{status:false,message:"Error",data:`${err}`});
    })
});

router.get('/drop_home',tools.info,(req,res)=>{
    res.render('stocker/drop_home',{subtitle:"Drop Home"});
})
router.post('/drop',tools.info,(req,res)=>{
    var db_name = req.body.db_name;
    var collection_name = req.body.collection_name;
    db.dropCollection(db_name, collection_name)
    .then(ret=>{
       router_log(`Dropped by body(collection name: ${req.body.collection_name})`)
       res.render('stocker/result',{status:true,message:`Dropped collection \'${collection_name}\'`})
    })
    .catch(err=>{
       router_log(`${err}`)
       res.render('stocker/result',{status:false, message:`Failed to drop collection \'${collection_name}\'`,data:`${err}`});
    })
    name = req.body.collection_name;
});

router.get('/all_home',tools.info,(req,res)=>{
   res.render('stocker/all_home',{subtitle:"Get all from Collection"});
});

router.post('/all',tools.info,(req,res)=>{
    var db_name = req.body.db_name;
    var collection_name = req.body.collection_name;
    if(!db || !collection_name){
       res.render('stocker/result',{status: false, message:`db and collection name are both required`});
    }else
    {
        db.get_all(db_name,collection_name)
        .then(d=>{
           router_log("Received: ")
           router_log(JSON.stringify(d));
           res.render('stocker/result',{status: true, message:`DB:${db_name} Collection: ${collection_name}`,data:`${JSON.stringify(d)}`})
        })
      .catch(e=>{throw e})
    }

});

router.get('/search_home',(req,res)=>{
    res.render("stocker/search_home",{subtitle:"Search Home"});
});

router.post('/search',tools.info,(req,res)=>{
    if(!req.body.collection_name){
        res.render("stocker/result",{status:false, message:"Collection required"});
    }
    if(req.body){
      var db_name = req.body.db_name;
      var search_params = tools.packdata(req.body);
      db.where(db_name, search_params)
      .then(ret=>{
         console.log(ret);
         res.render("stocker/result",{status:true,message:`Searched${JSON.stringify(search_params)} DB: [${db_name}], Collection [${search_params.collection_name}]`,data: (JSON.stringify(ret))});
        })
        .catch(err=>{
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
    var db_name = req.body.db_name;
    var insert_payload = tools.packdata(req.body);
    db.insert(db_name,insert_payload)
       .then(ret=>{
        console.log(ret.ops);
       res.render('stocker/result',{status:true, message:`Insert into db:${db_name} collection \'${insert_payload.collection_name}\'`,data:`${JSON.stringify(ret.ops)}`});
    })
       .catch(err=>{
           console.log(`Error: ${err}`)
        res.render('stocker/result',{status:false,message: `Error: ${err}`})
    })
})

router.get('/update_home',(req,res)=>{
    res.render('stocker/update_home',{subtitle:"Update Home"});
})
router.post('/update',(req,res)=>{
    var db_name = req.body.db_name;
    var collection_name = req.body.collection_name;
    var update_payload = tools.packdata(req.body);
    db.update(db_name,update_payload)
    .then(ret=>{
        console.log(ret.ops);
       res.render('stocker/result',{status:true, message:`Updated in collection \'${update_payload.collection_name}\' db:${db_name} `,data:`${JSON.stringify(ret)}`});
    })
    .catch(err=>{err});
})





module.exports = router;