var mongoose = require("mongoose");
var Schema = mongoose.Schema;

 var Login = new Schema({
     email: String,
     password: String,
   
 });

module.exports = mongoose.model("Logins", Login);