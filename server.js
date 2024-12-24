const express = require('express');
const ejs =  require('ejs');
const bodyparser = require('body-parser');
const mysql = require('mysql2');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
app.use(bodyparser.urlencoded({extended:true}));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

 mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'square'
});

app.use(express.static('public'));
app.set('view engine','ejs');



app.listen(3000);
//localhost:3000
app.get('/',function(req,res){
    let con = mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'',
        database:'square'
    });
    console.log('connected to db successfully...');
    con.query("SELECT * FROM products",(err,result)=>{
        if (err) {
            console.error("Error fetching data from the database:", err);
            return;
        }else{
            
            res.render('pages/index',{result:result});
            console.log('got items from db succesfully');
        }
        
    });
    
    
});
app.get('/index',function(req,res){
     let con = mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'',
        database:'square'
    });
    console.log('connected to db successfully...');
    con.query("SELECT * FROM products",(err,result)=>{
        if (err) {
            console.error("Error fetching data from the database:", err);
            return;
        }else{
            
            res.render('pages/index',{result:result});
            console.log('got items from db succesfully');
        }
        
    });
});

app.get('/product_info',function(req,res){
    
    const infos = req.session.productInfo;

    if (!infos) {console.log(infos);
        return res.redirect('/'); // If no product info in session, redirect to home
      }
      
      
    res.render('pages/product_info',{product:infos});
});
app.post('/product_info', function(req, res) {
    
    req.session.productInfo = { 
        id:req.body.id,
        img: req.body.img,
        title: req.body.title, 
        price: req.body.price 
    };
    
    res.redirect('/product_info');
});

function isProductInCart(cart,id){
    for(let i=0 ; i<cart.length ; i++){

        if(cart[i].id==id){
        return true;

    }
    }
    return false;
    };


    function calculatetotal(cart,req){
        total=0;
        for(let i=0;i<cart.lenght;i++){
            total = total + cart[i].price*cart[i].quantity;
        }
        req.session.total =total ;
        
        
        return total;
    }
    app.get('/cart', function(req, res) {
        // Initialize cart and total if not already set
        if (!req.session.cart) {
            req.session.cart = []; // Initialize as an empty array
        }
    
        if (!req.session.total) {
            req.session.total = 0; // Initialize as 0
        }
    
        let cart = req.session.cart;
        let total = req.session.total;
    
        res.render('pages/cart', { cart: cart, total: total });
    });
    


    app.post('/add', function (req, res) {
        const id = req.body.id;
        const price = parseFloat(req.body.price); // Ensure price is a number
        const name = req.body.title;
        const quantity = parseInt(req.body.quantity); // Ensure quantity is an integer
        const img = req.body.img;
    
        const product = { id: id, price: price, name: name, quantity: quantity, img: img };
    
        // Initialize cart if it doesn't exist
        if (!req.session.cart) {
            req.session.cart = [];
        }
    
        const cart = req.session.cart;
    
        // Check if the product is already in the cart
        if (!isProductInCart(cart, product.id)) {
            cart.push(product); // Add new product
        } else {
            // Update quantity of the existing product
            cart.forEach(item => {
                if (item.id === product.id) {
                    item.quantity += product.quantity; // Increment quantity
                }
            });
        }
    
        // Recalculate total
         calculatetotal(cart, req);
    
        // Redirect to the cart page
        res.redirect('/cart');
    });
    
    app.post('/cart/delete', function (req, res) {
        const productId = req.body.id;
    
        if (req.session.cart) {
            // Remove the product with the matching ID
            req.session.cart = req.session.cart.filter(product => product.id !== productId);
    
            // Recalculate total
            calculatetotal(req.session.cart, req);
        }
    
        res.redirect('/cart'); // Redirect back to the cart page
    });
    





