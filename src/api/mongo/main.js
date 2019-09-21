const mongo = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";

function log(str){
    console.log(`[Mongo] ${str}`)
}

function connect_mongo(){
    console.log("Connecting to MongoDB...");
    mongo.connect(url,{useNewUrlParser:true}, function (err, client) {
        if(err) {
           throw err;
        }
        else{
            log("Connected to MongoDB");
            db_obj = client.db("stocker");
            createCollection("sheet");
        }
       });
}

function createCollection(name){
    db_obj.createCollection(name,function(err,res){
        if(err){
            log(err);
            client.close();
        }else{
             log(`Created collection: ${name}`);
        }
    })
}

function insert(collection_name,val){
    var data={
        assets:{
            cash:val,
            cfafv:val,
            fvtoci_c:val,
            ac_c:val,
            fafh:val,
            nar:val,
            ar_rp:val,
            othr:val,
            inv:val
        },
        ca:{
            fvtoci_n:val,
            ac_v:val,
            iequ:val,
            ppe:val,
            int:val,
            dta:val,
            ofia:val,
        },
        nca:val,
        ta:val,
        liab:{
            stb:val,
            ap:val,
            ap_rp:val
        },
        tca:{
            dp:val,
            ditl:val,
            ll_n:val,
            onl:val
        },
        tnl:val,
        tl:val,
        tpcse:{
        ts:val,
        apic:val,
        re:val
    },
    te:val
    };
    db_obj.collection(collection_name).insertOne(data,function(err,res){
        if(err){
            console.log(err);
        }
        else{
            console.log("Success: inserted\n\t "+res.insertedId+"\n\t"+res.insertedCount);
       }
    })
}

function get_all(collection_name){
   return db_obj.collection(collection_name).find({}).toArray();
}
function drop_collection(collection_name){
    return db_obj.collection(collection_name).drop(function(err,ok){
        if(err){
            console.log(err);
        }
        if(ok){
            console.log("Dropped sheet");
        }
    });
}
module.exports = {
   connect_mongo,
   insert,
   get_all,
   drop_collection
};