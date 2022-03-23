let mongoose=require("mongoose");
let Schema=mongoose.Schema;

let Lista=new Schema({
    idComprador:Number,
    producto:String,
    precio:Number,
    total:Number,
    cantidad:Number,
    fechaCompra:String,
    estado:{
        type:Boolean,
        default: true
    }
});

module.exports=mongoose.model("Listas", Lista);
