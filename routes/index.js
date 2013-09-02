/*
 * GET home page.
 */
var models = require('../models.js');
var User = models.User;

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};
