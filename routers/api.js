/*  
*  created by Administrator
*  time is 2017-10-19 10:23
**/
var express = require('express');
var router = express.Router();
var User = require('../models/User')

var responseData;

router.use(function (req, res, next) {
    responseData = {
        code: 0,
        message: ''
    };
    next();
});

router.get('/user', function (req, res, next) {
    res.send('api User')
});

router.post('/user/register', function (req, res, next) {
    // console.log('register');
    // console.log(req.body)
    var username = req.body.username
    var password = req.body.password

    if (username == '') {
        responseData.code = 1;
        responseData.message = '用户名不能为空';
        res.json(responseData);
        return;
    }
    if (password == '') {
        responseData.code = 1;
        responseData.message = '密码不能为空';
        res.json(responseData);
        return;
    }

    User.findOne({
        username: username
    }).then(function (userInfo) {
        console.log(userInfo)
        if (userInfo) {
            responseData.code = 4;
            responseData.message = '该用户名已经被注册了';
            res.json(responseData);
            return;
        }
        var user = new User({
            username: username,
            password: password
        })
        return user.save()
    }).then(function (newUserInfo) {
        responseData.message = '注册成功';
        res.json(responseData);
    })

});

router.post('/user/login', function (req, res, next) {
    var username = req.body.username
    var password = req.body.password;
    if (username == '' && password == '') {
        responseData.code = 1;
        responseData.message = '用户名或密码不能为空';
        res.json(responseData)
        return;
    }
    User.findOne({
        username: username,
        password: password
    }).then(function (userInfo) {
        if (!userInfo) {
            responseData.code = 2;
            responseData.message = '用户名或密码错误';
            res.json(responseData);
            return;
        }
        responseData.userInfo = {
            _id: userInfo._id,
            username: userInfo.username,
            isAdmin:userInfo.isAdmin
        }
        responseData.message = '登录成功';
        req.cookies.set('userInfo',JSON.stringify(responseData.userInfo));
        res.json(responseData);
        return;
    })
})

router.post('/user/logout', function (req, res, next) {
    req.cookies.set('userInfo',null);
    res.json(responseData);
    return;
});

module.exports = router;