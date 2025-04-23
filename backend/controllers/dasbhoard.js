const express = require('express');
const app =  express.Router();
const verified = require('../util/dashboard')
app.get('/',verified,(res,req)=>{
    res.render('filedash')
})
app.get
module.exports = app;