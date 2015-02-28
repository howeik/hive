/*
 * Task API.
 */

var models = require('../models');

exports.all = function(req, res) {
	if (req.signedCookies.user_id == undefined) { res.send(500); return; }

	models.UserTasks.find({ 'user': req.signedCookies.user_id }).populate('user task').exec(function(err, userTasks) {
		if (err) { console.log(err); res.send(500); return; }

		if (userTasks == undefined) { res.redirect('/logout'); return; }


		var numTasksToPopulate = userTasks.length;
		if (numTasksToPopulate == 0) {
			console.log("returned!!!!!!!");
			res.send(200, {});
			return;
		}

		userTasks.forEach(function (userTask) {
			models.Class.populate(userTask.task, {path: 'class'}, function(err, _class) {
				numTasksToPopulate--;
				if (numTasksToPopulate == 0) {
					res.send(200, userTasks);
				}
			});
		});
	});
};

exports.super_all = function(req, res) {
	models.UserTasks.find().populate('user task').exec(function(err, userTasks) {
		if (err) { console.log(err); res.send(500); return; }

		if (userTasks == undefined) { res.redirect('/logout'); return; }


		var numTasksToPopulate = userTasks.length;
		if (numTasksToPopulate == 0) {
			console.log("returned!!!!!!!");
			res.send(200, {});
			return;
		}

		userTasks.forEach(function (userTask) {
			models.Class.populate(userTask.task, {path: 'class'}, function(err, _class) {
				numTasksToPopulate--;
				if (numTasksToPopulate == 0) {
					res.send(200, userTasks);
				}
			});
		});
	});
};

exports.add = function(req, res) {
	if (req.signedCookies.user_id == undefined) { res.send(500); return; }

	var taskId = req.body.taskId;
	models.UserTasks.create({ user: req.signedCookies.user_id, task: taskId}, function(err, userTask) {
		if (err) { console.log(err); res.send(500); return; }
		res.send(200, { "success": true });
	});
}

exports.create = function(req, res) {
	if (req.signedCookies.user_id == undefined) { res.send(500); return; }

	models.Task.create(req.body, function(err, task) {
		if (err) { console.log(err); res.send(500); return; }

		console.log("created task with id " + task._id);
		console.log(task);
		models.UserTasks.create({ user: req.signedCookies.user_id, task: task._id }, function(err, userTask) {
			if (err) { console.log(err); res.send(500); return; }

			res.send(200, { "success": true });
		});
	});
}

exports.update = function(req, res) {
	if (req.signedCookies.user_id == undefined) { res.send(500); return; }

	var userTask = req.body;
	models.UserTasks.findOne({ '_id': userTask._id, 'user': req.signedCookies.user_id }, function(err, stask) {
		if (err || stask == undefined) { console.log(err); res.send(500); return; }
		stask.is_finished = userTask.is_finished;
		stask.save();
		res.send(200, { success: true});
	});
}

exports.details = function(req, res) {
	var taskId = req.params.task_id;
	console.log(taskId);

	models.UserTasks.find({ 'task': taskId }, function(err, tasks) {
		if (err) { console.log(err); res.send(500); return; }

		res.send(200, { 'shareCount': tasks.length });
	});
}

exports.shared = function(req, res) {
	if (req.signedCookies.user_id == undefined) { res.send(500); return; }

	models.User.findOne( {'_id': req.signedCookies.user_id }, function(err, user) {
		if (err) { console.log(err); res.send(500); return; }

		if (user == undefined) { res.redirect('/logout'); return; }

		models.UserClasses
		.find({ 'user': user.id })
		.exec(function(err, userClasses) {
			if (err) { console.log(err); res.send(500); return; }

			var sharedTasks = [];

			var classesToProcess = userClasses.length;
			if (classesToProcess == 0) {
				res.send(200, {});
			}

			userClasses.forEach(function(userClass) {
				models.Task.find({ 'is_shared': true, 'class': userClass.class }).populate('class').exec(function(err, tasks) {
					if (err) { console.log(err); res.send(500); return; }

					sharedTasks = sharedTasks.concat(tasks);

					classesToProcess--;
					console.log("classesToProcess: " + classesToProcess);
					if (classesToProcess == 0) {
						res.send(200, sharedTasks);
					}
				});
			});
		});
	});
};