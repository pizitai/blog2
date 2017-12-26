/*  
*  created by Administrator
*  time is 2017-10-19 10:23
**/
var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Category = require('../models/Category');
var Content = require('../models/Content');

router.use(function (req, res, next) {
    if (!req.userInfo.isAdmin) {
        res.send('对不起，admin is required')
        return;
    }
    next()
})

router.get('/', function (req, res, next) {
    // console.log(req.userInfo)
    res.render('admin/index', {
        userInfo: req.userInfo
    })
    // res.send('admin User')
});
router.get('/user', function (req, res, next) {
    var page = Number(req.query.page || 1);
    var limit = 2;
    var pages = 0;

    User.count().then(function (count) {

        pages = Math.ceil(count / limit);
        page = Math.min(page, pages)
        page = Math.max(page, 1)
        var skip = (page - 1) * limit;

        User.find().limit(limit).skip(skip).then(function (users) {
            // console.log(users)
            res.render('admin/user_index', {
                userInfo: req.userInfo,
                users: users,
                count: count,
                pages: pages,
                limit: limit,
                page: page
            })
        })
    })
})

/*
* 分类首页
* */
router.get('/category', function (req, res, next) {
    var page = Number(req.query.page || 1);
    var limit = 2;
    var pages = 0;

    Category.count().then(function (count) {

        pages = Math.ceil(count / limit);
        page = Math.min(page, pages)
        page = Math.max(page, 1)
        var skip = (page - 1) * limit;
        /*
        * 1  升序
        * -1 降序
        * */
        Category.find().sort({_id: -1}).limit(limit).skip(skip).then(function (categories) {
            // console.log(users)
            res.render('admin/category_index', {
                userInfo: req.userInfo,
                categories: categories,
                count: count,
                pages: pages,
                limit: limit,
                page: page
            })
        })
    });
    /* res.render('admin/category_index', {
         userInfo: req.userInfo
     })*/
});
router.get('/category/add', function (req, res, next) {
    res.render('admin/category_add', {
        userInfo: req.userInfo
    })
})
router.post('/category/add', function (req, res, next) {
    var name = req.body.name || ''
    // console.log(req.body)
    if (name == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '名称不能为空'
        })
        return;
    }
    Category.findOne({
        name: name
    }).then(function (rs) {
        if (rs) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类已经存在'
            })
            return Promise.reject();
        } else {
            return new Category({
                name: name
            }).save();
        }
    }).then(function (newCategory) {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '分类保存成功',
            url: '/admin/category'
        })
    })
})

// router.get('/category/edit', function (req, res, next) {
//     var id = req.query.id || '';
//     console.log(id);
//     res.render('admin/category_edit', {
//         userInfo: req.userInfo
//     })
// });

router.get('/category/edit', function (req, res, next) {
    var id = req.query.id || '';
    console.log(id);
    Category.findOne({
        _id: id
    }).then(function (category) {
        if (!category) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类信息不存在'
            });
            return Promise.reject();
        } else {
            res.render('admin/category_edit', {
                userInfo: req.userInfo,
                category: category
            })
        }
    })
});

router.post('/category/edit', function (req, res, next) {
    var id = req.query.id || '';
    var name = req.body.name || '';
    Category.findOne({
        _id: id
    }).then(function (category) {
        if (!category) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类信息不存在'
            });
            return Promise.reject();
        } else {
            if (name == category.name) {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '修改保存成功',
                    url: '/admin/category'
                });
                return Promise.reject();
            } else {
                return Category.findOne({
                    _id: {$ne: id},
                    name: name
                })
            }
            // res.render('admin/category_edit',{
            //     userInfo:req.userInfo,
            //     category:category
            // })
        }
    }).then(function (sameCategory) {
        if (sameCategory) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '数据库中已经存在同名分类'
            });
            return Promise.reject();
        } else {
            return Category.update({
                _id: id
            }, {
                name: name
            })
        }
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '修改保存成功',
            url: '/admin/category'
        });
    })
})

router.get('/category/delete', function (req, res, next) {
    var id = req.query.id || '';
    Category.remove({
        _id: id
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/category'
        });
    })
})

/*
* 内容首页
* */
router.get('/content', function (req, res, next) {
    var page = Number(req.query.page || 1);
    var limit = 2;
    var pages = 0;
    // console.log('lalala')

    Content.count().then(function (count) {

        pages = Math.ceil(count / limit);
        page = Math.min(page, pages)
        page = Math.max(page, 1)
        var skip = (page - 1) * limit;
        /*
        * 1  升序
        * -1 降序
        * */
        Content.find().sort({_id: -1}).limit(limit).skip(skip).populate(['category','user']).then(function (contents) {
            console.log(contents)
            res.render('admin/content_index', {
                userInfo: req.userInfo,
                contents: contents,
                count: count,
                pages: pages,
                limit: limit,
                page: page
            })
        })
    });
    /* res.render('admin/content_index',{
         userInfo:req.userInfo
     })*/
});
router.get('/content/add', function (req, res, next) {
    Category.find().sort({_id: -1}).then(function (categories) {
        // console.log(rs)
        res.render('admin/content_add', {
            userInfo: req.userInfo,
            categories: categories
        })
    })
});

router.post('/content/add', function (req, res, next) {
    // console.log(req.body)
    if (req.body.category == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容分类不能为空'
        });
        return;
    }
    if (req.body.title == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容标题不能为空'
        });
        return;
    }
    new Content({
        category: req.body.category,
        title: req.body.title,
        user:req.userInfo._id.toString(),
        description: req.body.description,
        content: req.body.content
    }).save().then(function (rs) {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '内容保存成功',
            url: '/admin/content'
        });
    })
})

router.get('/content/edit', function (req, res, next) {
    var id = req.query.id || '';
    var categories
    Category.find().sort({_id: -1}).then(function (rs) {
        categories = rs
        return Content.findOne({
            _id: id
        }).populate('category');
    }).then(function (content) {
        // Content.findOne({
        //     _id:id
        // }).then(function (content) {
        if (!content) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '指定内容不存在'
            })
            return Promise.reject()
        } else {
            // Category.find().sort({_id:-1}).then(function (categories) {
            //     console.log(content)
            res.render('admin/content_edit', {
                userInfo: req.userInfo,
                content: content,
                categories: categories
            })
            // })
        }
        // })
    })
})

/*
保存修改内容
 */
router.post('/content/edit', function (req, res, next) {
    var id = req.query.id || '';
    if (req.body.category == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容分类不能为空'
        });
        return;
    }
    if (req.body.title == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容标题不能为空'
        });
        return;
    }
    Content.update({
        _id:id
    },{
        category: req.body.category,
        title: req.body.title,
        description: req.body.description,
        content: req.body.content
    }).then(function () {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'内容保存成功',
            url:'/admin/content/edit?id='+id
        })
    })
})

router.get('/content/delete', function (req, res, next) {
    var id = req.query.id || '';
    Content.remove({
        _id:id
    }).then(function () {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'删除成功',
            url:'/admin/content'
        })
    })
})

module.exports = router;