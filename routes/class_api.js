/*
 * Class API.
 */

var models = require('../models');

exports.all = function(req, res) {
	models.Class.find({ }).exec(function(err, classes) {
		if (err) { console.log(err); res.send(500); return; }

		res.send(200, classes);
	});
};

exports.enrolled = function(req, res) {
	if (req.signedCookies.user_id == undefined) {
		res.send(500);
		return;
	}

	models.User.findOne( {'_id': req.signedCookies.user_id }, function(err, user) {
		if (err) { console.log(err); res.send(500); return; }

		models.UserClasses
		.find({ 'user': user.id })
		.populate('user class')
		.exec(function(err, userClasses) {
			if (err) { console.log(err); res.send(500); return; }

			res.send(200, userClasses);
		});
	});
};