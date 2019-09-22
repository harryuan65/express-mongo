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

function list_collections(){
    return db_obj.listCollections().toArray();
}
var a = {
    k1:"v1",
    k2:"v2",
    k3:""
}

function filter(data){
    var newobj = {};
    for(var key in data){
        if(data[key]!="")
         {
             newobj[key]=data[key];
         }
    }
    return newobj;
}

function where(payload){
    log(`Search for ${payload.collection} ${JSON.stringify(payload.data)}`);
    return db_obj.collection(payload.collection).find(filter(payload.data)).toArray();
}
function get_all(collection_name){
    return db_obj.collection(collection_name).find({}).toArray();
}

function insert(payload){
    log(`Inserting ${JSON.stringify(payload)}`)
    return db_obj.collection(payload.collection).insertOne(payload.data);
}



module.exports = {
   connect_mongo,
   list_collections,
   insert,
   get_all,
   where,
   drop_collection
};