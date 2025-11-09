var express = require('express');
var axios = require("axios")
var loginService = require("../service/login")
var router = express.Router();
require('dotenv').config();
var session = require('express-session')

router.post('/',async(req,res)=>{
    try{
        const loginForm = req.body;
        
        const success = await loginService.login(loginForm.User_ID,loginForm.User_Pass)
        if (success){
            req.session.User_ID = loginForm.User_ID;
        }else{
            res.status(400).json({"message":"UnAuthorized"});
        }
        res.json({"data":(success)});
    }catch(err){
        res.status(400).json({"message":err.message})
    }
})
router.post('/logout',async(req,res)=>{
    try{
        res.clearCookie('session');
        res.clearCookie('session.sig');

        res.json({"data":("success")});
    }catch(err){
        res.status(400).json({"message":err.message})
    }
})
router.get('/status',(req,res)=>{
    try{
        
        if(req.session.User_ID){
            res.json({"data":true,"User_ID":req.session.User_ID});

        }else{
            res.json({"data":false})
        }
    }catch(err){
        res.status(400).json({"message":err.message})
    }
})
module.exports=router;