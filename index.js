let mongoose = require("mongoose");
let express = require("express");
let bodyParser = require("body-parser");
let passport= require ('passport');
let cookieParser=require('cookie-parser');
let session=require("express-session");
const {LocalStorage} = require("node-localstorage");
var localStorage = new LocalStorage('./scratch'); 

let app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', __dirname + '/src/views');
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(cookieParser());
app.use(session({
    secret:'secreto',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb+srv://bren21:*Bren2146@cluster0.lngd8.mongodb.net/ProyectoFinal?retryWrites=true&w=majority')
    .then(function (db) {
        console.log("Conectado a la BD");
    })
    .catch(function (err) {
        console.log(err);
    });
var Producto = require('./src/models/producto');
var Ventas = require('./src/models/ventas');
var Login= require('./src/models/login');

app.get('/store', async function (req, res) {
    let filter = {
        cantidad: {$gt : 0}
    }
    if (req.query.search) {
        filter = { producto: { $regex: '.*' + req.query.search + '.*', $options: 'i' }, ...filter }
    }
    var products = await Producto.find(filter);
    res.render('home', {products, header: 'home'});
});

app.get('/checkout', async function (req, res) {
    res.render('checkout', {header: 'checkout'});
});

app.post('/confirm-checkout', async function (req, res) {
    let {products, ...rest} = req.body
    let items= []
    let total = 0;
    products = JSON.parse(products)
    console.log(typeof products);
    products.map((item) => {
        items.push({
            precio: item.precio,
            name: item.producto,
            talla: item.talla,
            cantidad: 1,
            productId: item._id
        })
        total += item.precio
    })

    const data = {
        ...rest,
        items,
        total
    }
    const newVenta = new Ventas(data);
    await newVenta.save();

    products.map(async product => {
        await Producto.findById(product._id).exec((err, data) => {
            if (err) {
                return
            }
            Producto.findByIdAndUpdate(product._id, {
                $set: {
                    cantidad: data.cantidad - 1
                }
            },{
                new: true
            }, function(err, doc) {
                if (err) {
                    console.log('ocurrio un error al descontar la cantidad')
                };
                console.log(doc)
            })

        });
    })
    res.redirect('/store')
})
// app.get('/', function(req, res){
    
//      res.render('home.ejs', {
//         nuevo: true,
//         header: ""
//     });

// });
app.get('/login', function(req, res){
    
    res.render('login.ejs', {
       nuevo: true,
       header: ""
   });

});
app.get('/inicio', async function (req, res) {
    res.render('index');
});

app.get('/ventas', async function (req, res) {
    let ventas = await Ventas.find();

    res.render('ventas', {ventas});
});

app.get('/inventario', async function (req, res) {
    let compras = await Producto.find().sort({ idComprador: 1 });

    res.render('inventario', {
        productos: compras
    });
});


app.get('/crear', function (req, res) {

    res.render('agregar', {
        nuevo: true
    });

});
app.post('/login', async function (req, res) {
    var datos = req.body;

    var nuevoLogin = new Login(datos);
    await nuevoLogin.save();

    res.redirect('/store');
});

app.post('/comprar', async function (req, res) {
    var datos = req.body;

    var nuevoProducto = new Producto(datos);
    await nuevoProducto.save();

    res.redirect('/inventario');
});

app.get('/detalle/:id/:producto', async function (req, res) {
    let id = req.params.id;

    let compras = await Producto.findById(id);

    res.render('detalle', {
        res: compras
    });
});


app.get('/modificar/:id', async function (req, res) {
    let id = req.params.id;

    let compras = await Producto.findById(id);

    res.render('agregar', {
        nuevo: false,
        compras: compras
    });

});

app.post('/modificar', async function (req, res) {
    let datos = req.body;
    console.log(req.body);
    await Producto.updateOne({ _id: req.body.id }, datos);

    res.redirect("/inventario");

});


app.get('/eliminar/:id', async function (req, res) {
    let id = req.params.id;

    await Producto.findByIdAndRemove(id);

    res.redirect("/inventario");

});

app.listen(3010);