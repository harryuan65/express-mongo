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
module.exports = {
    info,
    packdata
}