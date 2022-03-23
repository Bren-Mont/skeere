let mongoose=require("mongoose");
let Schema=mongoose.Schema;

let Producto=new Schema({
    referencia: Number,
    producto:String,
    categoria:String,
    precio:Number,
    talla: String,
    cantidad:Number,
    fechaIngreso:String,
    thumbnailUrl:String,
    estado:{
        type:Boolean,
        default: true
    }
});

module.exports=mongoose.model("Productos", Producto);
