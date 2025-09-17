var express = require('express');
var axios = require("axios")
var chatservice = require("../service/chat")
var router = express.Router();

router.post(':uuid/content/:idx',async(req,res)=>{
    try{
        const definition = req.body;
        
        const response = chatservice.saveMap('luca',definition);
        res.json({"data":(await response).rowCount});
    }catch(err){
        res.status(400).json({"message":err.message})
    }
})
module.exports=router;