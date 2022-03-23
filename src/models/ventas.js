let mongoose=require("mongoose");
let Schema=mongoose.Schema;

let Ventas=new Schema({
    name: String,
    address:String,
    city:String,
    departamento:String,
    phone:Number,
    email:String,
    items: [{
        precio:Number,
        name: String,
        talla: String,
        cantidad:Number,
        productId:String,
    }],
    total:Number,
    create:String,
    update: String
});

module.exports=mongoose.model("Ventas", Ventas);