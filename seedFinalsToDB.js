
var mongoose = require('mongoose');
var models   = require('./models');

// Connect to the Mongo database, whether locally or on Heroku
// MAKE SURE TO CHANGE THE NAME FROM 'lab7' TO ... IN OTHER PROJECTS
var local_database_name = 'hive';
var local_database_uri  = 'mongodb://localhost/' + local_database_name;
var database_uri = process.env.MONGOLAB_URI || local_database_uri;

mongoose.connect(database_uri);

var classes = require('./final_classes.json');
var tasks = require('./final_tasks.json');

models.Class.find().remove().exec(function (err) {
	if (err) { console.log(err); return; }

	var classesToInsert = classes.length;
	classes.forEach(function(_class) {
		new models.Class(_class).save(function(err, _class) {
			if (err) { console.log(err); return; }

			--classesToInsert;
			console.log(classesToInsert + " classes left to insert.");
			if (classesToInsert == 0) {
				var tasksToInsert = tasks.length;
				tasks.forEach(function(task) {
					models.Class.findOne({ 'name': task.class_name, 'instructor': task.class_instructor }, function(err, __class) {
						if (err) { console.log(err); return; }
						task['class'] = __class._id;
						task['name'] = "Final Exam";
						task['description'] = "Study early!\n\nDownloaded from ucsd.edu"
						new models.Task(task).save(function(err, _task) {
							if (err) { console.log(err); return; }

							--tasksToInsert;
							console.log(tasksToInsert + " tasks left to insert.");
							if (tasksToInsert == 0) {
								console.log("Done!");
								mongoose.connection.close();
							}
						});
					});
				});
			}
		});
	});
});