var express = require('express');
var router = express.Router();
const db = require("../../api/mongo/mongo");
const tools = require('../../api/middleware/route_utils');

db.connect_mongo("stocker_api");

function api_log(str){
    console.log(`[StockerApi]${str}`);
}

router.get('/',(req,res)=>{
    res.set('Content-Type', 'text/html');
    res.status(200).send("Api is on");
});

router.get('/all',tools.info,(req,res)=>{
    var collection = "sheet";
    db.get_all(collection).then(d=>{
        api_log("Received: ")
        api_log(JSON.stringify(d));
        res.json(d);
      })
});

router.post('/insert',tools.info,(req,res)=>{
    var insert_payload = tools.packdata(req.body);
    db.insert(insert_payload)
       .then(ret=>{
        console.log(ret.ops);
        res.json(ret);
    })
       .catch(err=>{
        console.log(`Error: ${err}`)
        res.json(err);
    })
});

router.post('/search',tools.info,(req,res)=>{
    if(!req.body.collection){
        res.send("Collection required");
    }

    if(req.body){
      db.where(packdata(req.body))
      .then(ret=>{
          console.log(ret);
          res.json(ret);
        })
        .catch(err=>{
            console.log(ret);
            res.json(err);
        })
    }else{
        res.send("Search keywords required");
    }
});
router.post('/update',tools.info,(req,res)=>{
    api_log(`Updating ${req.body}`)
  db.update(tools.packdata(req.body))
    .then(ret=>{
      console.log(ret);
      res.json(ret);
    })
    .catch(err=>{
      api_log(err);
      res.json(err);
    })
})
router.get('/list_collections',(req,res)=>{
    db.list_collections().then(ret=>{
        api_log("All collections:");
        res.json(ret.map(d=>{
            api_log(JSON.stringify(d));
            return JSON.stringify(d)
           }));
    })
 });

module.exports = router;