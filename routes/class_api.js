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

exports.delete = function(req, res) {
	if (req.signedCookies.user_id == undefined) { res.send(500); return; }
	var classId = req.body.classId;

	models.UserClasses.find({ 'user': req.signedCookies.user_id, 'class': classId })
	.remove()
	.exec(function(err) {
		if (err) { console.log(err); res.send(500); return; }

		res.send(200, { success: true });
	});
}

exports.add = function(req, res) {
	if (req.signedCookies.user_id == undefined) { res.send(500); return; }

	var classId = req.body.classId;
	models.UserClasses.create({ user: req.signedCookies.user_id, 'class': classId }, function(err, userClass) {
		if (err) { console.log(err); res.send(500); return; }

		console.log("created userClass");
		console.log(userClass);

		res.send(200, {success: true});
	});
}

exports.enrolled = function(req, res) {
	if (req.signedCookies.user_id == undefined) {
		res.send(500);
		return;
	}

	models.User.findOne( {'_id': req.signedCookies.user_id }, function(err, user) {
		if (err) { console.log(err); res.send(500); return; }

		if (user == undefined) { res.redirect('/logout'); return; }

		var classes = []

		models.UserClasses
		.find({ 'user': user.id })
		.populate('user class')
		.exec(function(err, userClasses) {
			if (err) { console.log(err); res.send(500); return; }

			userClasses.forEach(function(userClass) {
				classes.push(userClass.class);
			});

			res.send(200, classes);
		});
	});
};