/*  
*  created by Administrator
*  time is 2017-10-20 10:20
**/
var mongoose = require('mongoose');
var contentsSchema = require('../schemas/contents');

module.exports = mongoose.model('Content',contentsSchema);