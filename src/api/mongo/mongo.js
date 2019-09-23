const mongo = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
const db_name = "stocker"
const testdata = require('../../tests/testdata');

function log(str){
    console.log(`[Mongo] ${str}`)
}

function connect_mongo(src=""){
    log(`${src} Connecting to MongoDB...`);
    mongo.connect(url,{useNewUrlParser:true,useUnifiedTopology: true}, function (err, client) {
        if(err) {
           throw err;
        }
        else{
            db_obj = client.db(db_name);
            log(`${src} Connected to MongoDB, database: ${db_name}`);
            createCollection("sheet")
            .then(ret=>{
                log(`${src} Created Collection => [name:`+JSON.stringify(ret.s.namespace.collection)+", id:"+JSON.stringify(ret.s.pkFactory.index)+", db:"+JSON.stringify(ret.s.namespace.db)+"]" );
            })
            .catch(err=>{
                log(`${src} ${err}`);
                client.close();
            })
        }
       });
}

function createCollection(name){
    return db_obj.createCollection(name);
}

function dropCollection(collection_name){
   return db_obj.collection(collection_name).drop();
}

function list_collections(){
    return db_obj.listCollections().toArray();
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
    var search_params = filter(payload.data);
    log(`Search for \"${payload.collection}\" ${JSON.stringify(search_params)}`);
    return db_obj.collection(payload.collection).find(search_params).toArray();
}
function get_all(collection_name){
    return db_obj.collection(collection_name).find({}).toArray();
}

function insert(payload){
    log(`Inserting ${JSON.stringify(payload)}`)
    return db_obj.collection(payload.collection).insertOne(payload.data);
}
function update(payload){
    log(`Update ${JSON.stringify(payload)}`);
    var update_params = payload.data.to;
    delete payload.data.to;
    return db_obj.collection(payload.collection).updateOne(payload.data,{$set:update_params});
}


module.exports = {
   connect_mongo,
   list_collections,
   insert,
   get_all,
   where,
   createCollection,
   dropCollection,
   update
};