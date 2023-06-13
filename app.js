require("dotenv").config() ;
const express = require("express") ;
const bodyParser = require("body-parser") ;
const ejs = require("ejs") ;
const mongoose = require("mongoose") ;
const encrypt = require("mongoose-encryption") ;
const app = express() ;

app.use(express.static("public")) ;
app.set('view engine', 'ejs') ;
app.use(bodyParser.urlencoded({extended:true})) ;
mongoose.connect("mongodb://127.0.0.1:27017/Secretsdb") ;
mongoose.set('strictQuery', true);
 
const secretSchema = new mongoose.Schema({
    email : String ,
    password : String 
}); 
// to access data in env file
// console.log(process.env.SECRET)

secretSchema.plugin(encrypt, { secret: process.env.SECRET , excludeFromEncryption: ['email'] });
// or use encryptedFields: ['password']
const User = new mongoose.model("User" , secretSchema) ;
 
app.get("/",function(req,res){
    res.render("home") ;
}) ;

app.get("/login",function(req,res){
    res.render("login") ;
}) ;
app.get("/register",function(req,res){
    res.render("register") ;
}) ;

app.post("/register", function(req,res){
    const item = new User({
        email : req.body.username ,
        password: req.body.password 
    }) ;

    item.save(function(err){
        if(err){
            console.log(err) ;
        }
        else{
            res.render("secrets") ;
        }
    }) ;
}) ;

app.post("/login" , function(req,res){
    User.findOne({email : req.body.username} , function(err,foundUser){
        if(err){
            console.log(err) ;
        }
        else{
            if(foundUser.password === req.body.password){
                res.render("secrets") ;
            }
        }
    }) ;
}) ;

app.listen(3000 , function(){
    console.log("Server started at Port 3000") ;
}) ;