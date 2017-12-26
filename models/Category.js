/*  
*  created by Administrator
*  time is 2017-10-19 17:23
**/
var mongoose = require('mongoose');
var categorySchema = require('../schemas/categories');

module.exports = mongoose.model('Category',categorySchema);
