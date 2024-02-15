// Import the MySQL connection pool
const pool = require('./connectiondb'); // Assuming db.js is in the same directory
const express = require('express');
const bodyParser =require('body-parser');
var app=express();

app.use(bodyParser.json());

app.get('/homepage',(req,res)=>{
    pool.query('select * from user',(err,rows)=>{
        if(err){
            console.log(err);
        }
        else{
            res.send(rows);
        }
    })
})

app.listen(3000,()=>console.log("express server is running"));
