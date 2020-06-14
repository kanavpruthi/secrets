//jshint esversion:6

require('dotenv').config();

const express= require('express');
const ejs=require('ejs');
const bodyParser=require('body-parser');
const { log } = require('console');
const mongoose = require('mongoose');
const encrypt= require('mongoose-encryption');

const app=express();

mongoose.connect('mongodb://localhost:27017/userDB',{useNewUrlParser:true,useUnifiedTopology:true});

const userSchema= mongoose.Schema({
    email:String,
    password:String
});

//random string to encrypt the data

userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:['password']});

const User = mongoose.model('User',userSchema);

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

app.get('/',function(req,res){
    res.render('home');
});

app.get('/login',function(req,res){
    res.render('login');
});

app.get('/register',function(req,res){
    res.render('register');
});

app.post('/register',function(req,res){
    const newUser = new User({
        email:req.body.username,
        password:req.body.password,
    });

    newUser.save(function(err){
        if(err){
            console.log(err);
            
        }else{
            res.render('secrets');
        }
    });

});

app.post('/login',function(req,res){
    const username= req.body.username;
    const password= req.body.password;
    
    User.findOne({email:username},function(err,foundUser){
        if(err){
            console.log(err);
            
        }else if(foundUser){
            if(password===foundUser.password){
                res.render('secrets');
            }
        }
    });
});

app.listen(3000||process.env.PORT,function(){
    console.log('Server up and running on port 3000.');
    
});