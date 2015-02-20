var models = require('../models');

exports.view = function(req, res){
  res.render('signup');
};

exports.signup = function(req, res){
  console.log(req.body);

  	var name = req.body.username;
};