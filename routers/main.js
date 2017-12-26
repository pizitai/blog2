/*  
*  created by Administrator
*  time is 2017-10-19 10:23
**/
var express = require('express');
var router = express.Router();
var Category = require('../models/Category');

router.get('/', function (req, res, next) {
    // console.log(req.userInfo)
    res.render('main/index')
    // res.send('api User')
});

router.get('/nav', function (req, res, next) {
    Category.find().then(function (rs) {
        // console.log(rs)
        res.render('main/nav', {
            userInfo: req.userInfo,
            categories:rs
        })
    })
});

module.exports = router;