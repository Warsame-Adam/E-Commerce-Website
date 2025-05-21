import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import cors from "cors";

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URL);


//API CREATION

app.get("/", (request,response)=> {
    response.send("Express App is running")

})

//image storage part 

const storage = multer.diskStorage({
    destination:'./upload/images',
    filename:(req,file,cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)

    }
})

const upload = multer({storage:storage})

//creating upload endpoint for the images
app.use('/images', express.static('upload/images'))

app.post("/upload",upload.single('product'), (req,res) => {
    res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })

})

// Schema for the products

const Product = mongoose.model("Product",{
    id:{
        type: Number,
        require: true,
    },
    name:{
        type: String,
        require: true,
    },
    image:{
        type: String,
        required: true,
    },
    category:{
        type: String,
        require: true,
    },
    new_price:{
        type:Number,
        required: true,
    },
    old_price:{
        type: Number,
        require: true,
    },
    date:{
        type: Date,
        default: Date.now,
    },
    available:{
        type: Boolean,
        default: true,
    }


})

app.post('/addproduct', async (req,res) =>{
    let products = await Product.find({});
    let id;
    if (products.length >0) {
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id+1
    }
    else{
        id =1;
    }
    const product = new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,

    })
    console.log(product)
    await product.save();
    console.log("Saved")
    res.json({
        success: true,
        name: req.body.name
    })

})

//the API for removing the product

app.post('/removeproduct', async (req,res) => {
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    res.json({
        success:true,
        name:req.body.name
    })
})

//Creating api to get all products
app.get('/allproducts', async (req,res)=> {
    let products = await Product.find({});
    console.log("all products fetched",products.length);
    res.send(products);
})

//schema for user model

const Users  = mongoose.model('Users',{
    name:{
        type:String
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now(),
    }

})

// API endpoints for registering the user

app.post('/signup', async (req,res)=>{

    let check = await Users.findOne({email:req.body.email});
    if (check){
        return res.status(400).json({success:false,errors:"existing user found with same email adress"})
    }
    let cart = {};
    for (let i = 0; i < 300; i++) {
        cart[i] = 0;
    }
    const user  = new Users({
        name:req.body.username,
        email: req.body.email,
        password:req.body.password,
        cartData:cart,
    })
    await user.save();

    const data = {
        user:{
            id:user.id
        }
    }

    const token = jwt.sign(data, 'secret_ecommerce');
    res.json({success:true,token})
})

//endpoint for user login 
app.post('/login', async (req,res)=>{
    let user = await Users.findOne({email:req.body.email});
    if (user) {
        const passCompare = req.body.password === user.password;
        if (passCompare) {
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data, 'secret_ecommerce');
            res.json({success:true, token})
        }
        else {
            res.json({success:false,errors:"wrong pasword"});
        }
    }
    else{
        res.json({success:false,errors:"wrong email id"});

    }
})

// creating endpoint for newcollection data
app.get('/newcollections', async (req, res) => {
    try {
      // Fetch 8 random products using MongoDB's aggregation framework
      let newcollection = await Product.aggregate([{ $sample: { size: 8 } }]);
      console.log("New Collection fetched");
      res.send(newcollection);
    } catch (error) {
      console.error("Error fetching new collection:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  
  //endpoint for popular in women section
  app.get('/popularinwomen', async (req, res)=>{
    let products = await Product.find({category:"women"});
    let popular_in_women = products.slice(0,4);
    console.log("Popular in women fetched");
    res.send(popular_in_women);

  });

  //creating middleware to fetch user
  const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(400).send({ errors: "Please authenticate using a valid token" });
    }
    try {
        const data = jwt.verify(token, 'secret_ecommerce');
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ errors: "Please authenticate using a valid token" });
    }
};

  // creating endpoint for adding products in cartdata
  app.post('/addc', fetchUser, async (request,response)=>{
    console.log('Request received at /addtocart');
    console.log('Request body:', request.body);
    console.log('Authenticated user:', request.user);
    let userData = await Users.findOne({_id:request.user.id});
    userData.cartData[request.body.itemId] +=1;
    await Users.findOneAndUpdate({_id:request.user.id},{cartData:userData.cartData});
    response.send("Added")
  })

  //creating endpoint to remoce product from cart
  app.post('/removec', fetchUser, async (request,response)=>{
    let userData = await Users.findOne({_id:request.user.id});
    if (userData.cartData[request.body.itemId]>0)
    userData.cartData[request.body.itemId] -=1;
    await Users.findOneAndUpdate({_id:request.user.id},{cartData:userData.cartData});
    response.send("Removed")
  })

  //creating endpoint to get cartData
  app.post('/getcart', fetchUser, async (request,response)=>{
    console.log("Get Cart");
    let userData  = await Users.findOne({_id:request.user.id});
    response.json(userData.cartData);
  })

app.listen(port, (error)=>{
    if(!error) {
        console.log("Server is running on port "+port)
    }
    else{
        console.log("Error: "+error)
    }

})