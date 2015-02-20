/*
 * Task API.
 */

var models = require('../models');

exports.all = function(req, res) {
	if (req.signedCookies.user_id == undefined) { res.send(500); return; }

	models.UserTasks.find({ 'user': req.signedCookies.user_id }).populate('user task').exec(function(err, userTasks) {
		if (err) { console.log(err); res.send(500); return; }

		var numTasksToPopulate = userTasks.length;

		userTasks.forEach(function (userTask) {
			models.Class.populate(userTask.task, {path: 'class'}, function(err, _class) {
				console.log("populated class " + _class);
				numTasksToPopulate--;
				if (numTasksToPopulate == 0) {
					res.send(200, userTasks);
				}
			});
		});
	});
};

exports.shared = function(req, res) {
	if (req.signedCookies.user_id == undefined) { res.send(500); return; }

	models.User.findOne( {'_id': req.signedCookies.user_id }, function(err, user) {
		if (err) { console.log(err); res.send(500); return; }

		models.UserClasses
		.find({ 'user': user.id })
		.exec(function(err, userClasses) {
			if (err) { console.log(err); res.send(500); return; }

			var sharedTasks = [];

			var classesToProcess = userClasses.length;
			userClasses.forEach(function(userClass) {
				models.Task.find({ 'is_shared': true, 'class': userClass.class }).populate('class').exec(function(err, tasks) {
					sharedTasks = sharedTasks.concat(tasks);

					classesToProcess--;
					if (classesToProcess == 0) {
						res.send(200, sharedTasks);
					}
				});
			});
		});
	});
};