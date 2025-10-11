var express = require('express');
var axios = require("axios")
var chatservice = require("../service/chat")
var router = express.Router();
/* GET home page. */
router.post('/', async (req, res) => {
    const { input } = req.body;
    try{
        var jsonObj =await chatservice.chat(input)
    }catch(err){
        res.status(400).json({"message":err.message})
    }
    res.json(jsonObj);

});
router.post('/map',async(req,res)=>{
    try{
        const definition = req.body;
        
        const response = chatservice.saveMap(req.session.User_ID,definition);
        res.json({"data":(await response).rowCount});
    }catch(err){
        res.status(400).json({"message":err.message})
    }
})

router.get('/map',async(req,res)=>{
    try{

        const response = chatservice.getMap(req.session.User_ID);
        res.json({"data":(await response).rows});
    }catch(err){
        res.status(400).json({"message":err.message})
    }
})
router.get('/map/:uuid',async(req,res)=>{
    try{
        const uuid = req.params.uuid; 
        const response = chatservice.getMapByUUID(req.session.User_ID,uuid);
        res.json({"data":(await response)});
    }catch(err){
        res.status(400).json({"message":err.message})
    }
})
router.post('/map/:uuid/source',async(req,res)=>{
    try{
        const uuid = req.params.uuid; 
        let definition =(await chatservice.getMapByUUID(req.session.User_ID,uuid));
        definition= await chatservice.addSource(definition);
        res.json({"data":definition});
    }catch(err){
        res.status(400).json({"message":err.message})
    }
})
router.post('/map/:uuid/phase',async(req,res)=>{
    try{
        const uuid = req.params.uuid; 

        const phase = req.body;
        let originalMap = await chatservice.getMapByUUID(req.session.User_ID,uuid);
        originalMap.phase= phase
        const response = chatservice.saveMap('luca',originalMap);
        res.json({"data":(await response).rowCount});
    }catch(err){
        res.status(400).json({"message":err.message})
    }
})
module.exports = router;