
const express = require("express");
let app = express();
const PORT = 3000;
const path = require("path");
const bodyParser = require("body-parser");

app.set("view engine","ejs");
app.set("views",path.resolve("./src/views"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use('/stocker', require("./src/api/routes/api"));

const router = express.Router();
app.use(express.static(path.join(__dirname,'/public')));//這一行一定要放在use router上面

app.get('/',(req,res)=>{
    // res.send("Hello Node.js");
    res.render('index');
})
app.use((req,res,err) => {
    if(err){
        res.send(err.message);
    }
});


app.listen(PORT, err =>{
    if(err) return console.log(`Cannot Listen on PORT: ${PORT}`) ;
    console.log(`Server is Listening on : http://localhost:${PORT}/`);
});

