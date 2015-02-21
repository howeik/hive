/*
 * User API.
 */

var models = require('../models');

exports.login = function(req, res) {
	var email = req.query.email.toLowerCase();
	var password = req.query.password;

	models.User.find({ 'email': email }).exec(function(err, users) {
		if (err) { console.log(err); res.send(500); }

		var success = false;
		if (users.length == 1) {
			var correctPassword = users[0].password;
			if (correctPassword == password) {
				success = true;
			}
		}

		res.send(200, { "success": success });
	});
};

exports.all = function(req, res) {
	models.User.find({}, function(err, users) {
		res.send(200, users);
	});
};

exports.me = function(req, res) {
	if (req.signedCookies.user_id == undefined) { res.send(500); return; }
	models.User.findOne({ _id: req.signedCookies.user_id }, function(err, user) {
		if (err) { console.log(err); res.send(500); return; }
		if (user == undefined) { res.redirect('/logout'); return; }
		res.send(200, user);
	});
}