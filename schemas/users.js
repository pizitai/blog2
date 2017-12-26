/*  
*  created by Administrator
*  time is 2017-10-19 10:34
**/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = new Schema({
    username: String,
    password: String,
    isAdmin: {
        type: Boolean,
        default: false
    }
});