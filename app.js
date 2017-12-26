/*  
*  created by Administrator
*  time is 2017-10-19 08:48
**/
var express = require('express');
var swig = require('swig');
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var Cookies = require('cookies')
var app = express();

var User = require('./models/User')

app.use('/public',express.static(__dirname+'/public'))
app.use('/static',express.static(__dirname+'/static'))
app.use(function (req,res,next) {
    req.cookies = new Cookies(req,res)
    req.userInfo={};
    if(req.cookies.get('userInfo')){
        try {
            req.userInfo=JSON.parse(req.cookies.get('userInfo'))

            User.findById(req.userInfo._id).then(function (userInfo) {
                // console.log(userInfo)
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                // next()
            })
        }catch (e){
            console.log(e)
            next()
        }
    }else {
        console.log('*****')
    }
    next()
})

app.engine('html', swig.renderFile);
app.set('views', './views');
app.set('view engine', 'html');

swig.setDefaults({cache: false});

app.use(bodyParser.urlencoded({extended:true}));

app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main'));

/*app.get('/', function (req, res, next) {
    res.render('index')
    // res.send('<h1>欢迎光临我的博客</h1>')
});*/

/*app.get('/main.css', function (req, res, next) {
    // res.render('index')
    res.setHeader('content-type','text/css')
    res.send('body{background:red}')
});*/
mongoose.connect('mongodb://localhost:27018/blog', function (err) {
    if(err){
        console.log("数据库连接失败")
    }else {
        console.log("数据库连接成功")
        app.listen(8081);
    }
});
