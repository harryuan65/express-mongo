const mongo = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
const db_name = "stocker"
const testdata = require('../../tests/testdata');

function log(str){
    console.log(`[Mongo] ${str}`)
}

function connect_mongo(){
    console.log("Connecting to MongoDB...");
    mongo.connect(url,{useNewUrlParser:true,useUnifiedTopology: true}, function (err, client) {
        if(err) {
           throw err;
        }
        else{
            log(`Connected to MongoDB, database: ${db_name}`);
            db_obj = client.db(db_name);
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
    db_obj.collection(collection_name).insertOne(data,function(err,res){
        if(err){
            log(err);
        }
        else{
            log("Success: inserted\n\t "+res.insertedId+"\n\t"+res.insertedCount);
       }
    })
}

function get_all(collection_name){
   return db_obj.collection(collection_name).find({}).toArray();
}
function drop_collection(collection_name){
    db_obj.collection(collection_name).drop(function(err,ok){
        if(err){
            log(err);
            return false;
        }
        if(ok){
            log(`Dropped ${collection_name}`);
            return true;
        }
    });
}
module.exports = {
   connect_mongo,
   insert,
   get_all,
   drop_collection
};