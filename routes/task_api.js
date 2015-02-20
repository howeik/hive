/*
 * Task API.
 */

var models = require('../models');

exports.all = function(req, res) {
	if (req.signedCookies.user_id == undefined) { res.send(500); return; }

	models.UserTasks.find({ 'user': req.signedCookies.user_id }).populate('user task').exec(function(err, userTasks) {
		if (err) { console.log(err); res.send(500); return; }

		console.log("IN FIND USER");


		var numTasksToPopulate = userTasks.length;
		if (numTasksToPopulate == 0) {
			console.log("returned!!!!!!!");
			res.send(200, {});
			return;
		}

		console.log("SET numTasksToPopulate TO : " + numTasksToPopulate);

		userTasks.forEach(function (userTask) {
			models.Class.populate(userTask.task, {path: 'class'}, function(err, _class) {
				console.log("populated class " + _class);
				numTasksToPopulate--;
				console.log("numTasksToPopulate: " + numTasksToPopulate);
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

		console.log("created user task with id " + userTask._id);
		console.log(userTask);
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

			console.log("created user task with id " + userTask._id);
			console.log(userTask);
			res.send(200, { "success": true });
		});
	});
}

exports.update = function(req, res) {
	if (req.signedCookies.user_id == undefined) { res.send(500); return; }

	var task = req.body;
	models.UserTasks.findOne({ '_id': task._id }, function(err, stask) {
		stask.is_finished = task.is_finished;
		res.respond(200, { success: true});
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

		models.UserClasses
		.find({ 'user': user.id })
		.exec(function(err, userClasses) {
			if (err) { console.log(err); res.send(500); return; }

			var sharedTasks = [];
			console.log(userClasses);

			var classesToProcess = userClasses.length;
			userClasses.forEach(function(userClass) {
				models.Task.find({ 'is_shared': true, 'class': userClass.class }).populate('class').exec(function(err, tasks) {
					if (err) { console.log(err); res.send(500); return; }

					sharedTasks = sharedTasks.concat(tasks);

					console.log(sharedTasks);

					classesToProcess--;
					console.log("classesToProcess: " + classesToProcess);
					if (classesToProcess == 0) {
						console.log("sending thing");

						res.send(200, sharedTasks);
						console.log("sent thing");
					}
				});
			});
		});
	});
};