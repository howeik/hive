var models = require('../models');

exports.welcome = function(req, res) {
	res.render('welcome', {});
}

exports.login = function(req, res) {
	res.render('welcome_login', {});
}

exports.signup = function(req, res) {
	res.render('welcome_signup', {});
}
