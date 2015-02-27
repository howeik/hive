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

	models.UserTasks.find({'user': req.signedCookies.user_id}).populate('task').exec(function(err, userTasks) {
		var numTasksToPopulate = userTasks.length;
		if (numTasksToPopulate == 0) {
			console.log("returned!!!!!!!");
			res.send(200, { success: true });
			return;
		}

		var tasksToDelete = [];
		userTasks.forEach(function (userTask) {
			models.Class.populate(userTask.task, {path: 'class'}, function(err, populatedTask) {
				if (populatedTask.class != undefined) {
					if (populatedTask.class._id == classId) {
						tasksToDelete.push(populatedTask);
					}
				}

				numTasksToPopulate--;
				if (numTasksToPopulate == 0) {
					var numTasksToDelete = tasksToDelete.length;
					console.log("deleting " + numTasksToDelete + " tasks");
					if (numTasksToDelete == 0) {
						res.send(200, {success:true});
						return;
					}

					tasksToDelete.forEach(function(taskToDelete) {
						models.UserTasks.find({'user': req.signedCookies.user_id, 'task': taskToDelete._id}).remove(function(err, ut) {
							if (err) { console.log(err); res.send(500); return; }

							--numTasksToDelete;
							if (numTasksToDelete == 0) {
								res.send(200, { success: true });
							}
						});

					});


				}
			});
		});
	});	});


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