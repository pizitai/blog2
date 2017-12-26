/*  
*  created by Administrator
*  time is 2017-10-20 10:13
**/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = new Schema({
    //关联字段
    category: {
        type:Schema.Types.ObjectId,
        ref:'Category'
    },
    user: {
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    addTime:{
        type:Date,
        default:new Date()
    },
    views:{
        type:Number,
        default:0
    },
    title: String,
    description: {
        type: String,
        default: ''
    },
    content:{
        type:String,
        default:''
    }
});