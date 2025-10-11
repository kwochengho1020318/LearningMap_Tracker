var express = require('express');
var axios = require("axios")
var postgres= require("../utils/postgres")
const crypto = require('crypto');

async function login(User_ID,User_Pass){
    const phash = crypto.createHash('md5').update(User_Pass).digest('hex');
    ex= (await postgres.query('select * from "LMT"."Users" where "User_ID"=$1 and "User_Pass" = $2',[User_ID,phash])).rows.length;
    if(ex==0){
        return false
    }
    else{
        return true;
    }
}
module.exports={login}