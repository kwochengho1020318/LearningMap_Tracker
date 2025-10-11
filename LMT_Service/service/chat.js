var express = require('express');
var axios = require("axios")
var postgres= require("../utils/postgres")
require('dotenv').config();

const { v4: uuidv4 } = require('uuid');

const format = '{ "target": "subject name", "phase": [ { "name": "基礎知識", "time": "2-4 週", "content": [ { "name":"內容1", "source":[//this is an object{"type":"text","content":"some details or tutorial text"} ]}, { "name":"內容2", "source":[{這個type很重要!!!"type":"text","content":"my custom tutorial"}] } ] ,"practice":[ { "name":"實戰練習1","type":"text","content":"everyday practice for the phase" } ],"test":{ "name":"檢視是否掌握技能的測驗","type":"text","content":"milestone test to reach" } } ] }'
const GOOGLE_API_KEY=process.env.GOOGLE_API_KEY;
const GOOGLE_CX=process.env.GOOGLE_CX;
const OLLAMA_API = process.env.OLLAMA_API;
async function chat(input) {
    const uuid = uuidv4();
    const response = await axios.post(`${OLLAMA_API}/api/generate`, {
        "model": "gemma3:12b",  // 模型名称
        "prompt": `請幫我擬定${input}的學習計畫，請嚴格以以下的格式回復，source部分必須是物件格式，裡面會標註type是url還是純text，並以content來做內容。嚴格以${format}的格式回答 並只回答json部分 請以中文回答`, // 输入的提示词
        "stream": false,          // 是否启用流式响应（默认 false）
        "options": {              // 可选参数
            "temperature": 0.7,     // 温度参数
            "max_tokens": 100       // 最大 token 数
        }
    });
    if (!input) {
       throw new Error("no input!")
    }
    var chatresponse = response.data.response;
    console.log(chatresponse);
    const regex = /```json\s*([\s\S]*?)\s*```/i;
    const match = chatresponse.match(regex);
    console.log(match[1]);
    if (match) {
        try {
            const jsonObj = JSON.parse(match[1]);
            jsonObj.uuid=uuid
            return jsonObj
        } catch (err) {
            throw new Error(err.message);
        }
    } else {
        throw new Error("no json area");
    }
}
async function addSource(definition){
    for(phase of definition.phase){

        for(content of phase.content){
            content.complete=false
            let response = await searchGoogle(content.name+definition.target);
            console.log(response);
            content.source.push(...response);
        }
    }
    definition.init=true;
    return definition
}
async function searchGoogle(query) {
  const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
    query
  )}&key=${GOOGLE_API_KEY}&cx=${GOOGLE_CX}`;
  const res = await axios.get(url);

  const json = res.data;
  // 取前 5 筆結果
  return (json.items || []).slice(0, 5).map(item => ({
    type: "url",
    title: item.title,
    link: item.link,
    snippet: item.snippet,
    content:item.link,
    icon:item.pagemap&&item.pagemap.cse_image? item.pagemap.cse_image[0]:null
  }));
}
async function saveMap(User_ID,definition){
    if(!definition.init)definition=await addSource(definition);
    return await postgres.query('insert into "LMT"."Learning_Map"("User_ID","Definition","UUID")values($1,$2,$3) on conflict("UUID") do update set "Definition"=$2 ',[User_ID,definition,definition.uuid]);
}
async function getMap(User_ID){
    return await postgres.query('select * from "LMT"."Learning_Map" where "User_ID"=$1',[User_ID]);
}
async function getMapByUUID(User_ID,UUID){
    return (await postgres.query('select * from "LMT"."Learning_Map" where "User_ID"=$1 and  "UUID"=$2',[User_ID,UUID])).rows[0].Definition;
}
async function deleteMap(UUID){
    return await postgres.query('delete from "LMT"."Learning_Map" where "UUID"=$1',[UUID]);
}
module.exports = { chat ,saveMap,getMap,deleteMap,getMapByUUID,addSource}
