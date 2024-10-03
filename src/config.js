const { name } = require("ejs");
const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/logininfo");
connect.then(() =>{
    console.log("database connected");

})
.catch(()=>{
    console.log("database not connected");
});

//cretae schemea 
const logininfoSchemea = new mongoose.Schema({
    name:{
        type: String,
        required : true
    },
    password:{
        type: String,
        required: true
    }
});

//collection part
 const collection = new mongoose.model("details",logininfoSchemea);

 module.exports = collection;