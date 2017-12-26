/*  
*  created by Administrator
*  time is 2017-10-19 11:14
**/
var mongoose = require('mongoose');
var usersSchema = require('../schemas/users');

module.exports = mongoose.model('User',usersSchema);
