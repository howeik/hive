/*
 * User API.
 */

var models = require('../models');

exports.decline = function(req, res) {
  if (req.signedCookies.user_id == undefined) { res.send(500); return; }

  var taskId = req.body.taskId;
  models.User.findOne({'_id': req.signedCookies.user_id}, function(err, user) {
    if (err) { console.log(err); res.send(500); return;}
    if (user == undefined) { res.redirect('/logout'); return; }

    user.declined.push(taskId);
    user.save();

    res.send(200, {success: true});
  });
};

exports.declined = function(req, res) {
  if (req.signedCookies.user_id == undefined) { res.send(500); return; }

  models.User.findOne({'_id': req.signedCookies.user_id}, function(err, user) {
    if (err) { console.log(err); res.send(500); return;}
    if (user == undefined) { res.redirect('/logout'); return; }

    res.send(200, user.declined);
  });
};

exports.adduser = function(req, res){
  console.log(req.body);

  var name = req.body.name;
  var email = req.body.email.toLowerCase();
  var password = req.body.password;

  console.log(name);
  console.log(email);
  console.log(password);

  var newUser = new models.User({'name':name, 'email':email, 'password':password});
  newUser.save(afterSave);

  function afterSave(err) {
   if (err) { console.log(err); res.send(500); return;}
    var email = req.body.email.toLowerCase();
    var password = req.body.password;

    models.User.find({ 'email': email }).exec(function(err, users) {
      if (err) { console.log(err); res.send(500); }

      var success = false;
      var user_id = null;
      if (users.length >= 1) {
        var correctPassword = users[0].password;
        if (correctPassword == password) {
          success = true;
          user_id = users[0]._id;
        }
      }

      if (success) {
        res.cookie('user_id', user_id, {signed: true})
        console.log("user of user_id " + user_id + " signed in!");

        var due_date = new Date();

        tutorialTasks = [{
          "name": "Add your classes in the 'Account' Tab",
          "class_name": "Tutorial",
          "description": "So we can connect you with your classmates!",
          "due_date": new Date(due_date.getTime() + 1),
          "is_shared": false,
          "is_endorsed": false
        }, {
          "name": "Go to the 'Shared' tab and see shared tasks!",
          "class_name": "Tutorial",
          "description": "You can see what tasks other people in your classes are doing then add them in one click!",
          "due_date":  new Date(due_date.getTime() + 2),
          "is_shared": false,
          "is_endorsed": false
        }, {
          "name": "Add and contribute your own tasks!",
          "class_name": "Tutorial",
          "description": "See a task that's missing? Add it to your own task list and share it with the class!",
          "due_date":  new Date(due_date.getTime() + 3),
          "is_shared": false,
          "is_endorsed": false
        }]

        tasksToCreate = tutorialTasks.length;

        tutorialTasks.forEach(function(tutorialTask) {
          models.Task.create(tutorialTask, function(err, task) {
            if (err) { console.log(err); res.send(500); return; }

            models.UserTasks.create({user: user_id, task: task._id, is_finished: false}, function(err, userTask) {
              if (err) { console.log(err); res.send(500); return; }
              --tasksToCreate;
              if (tasksToCreate == 0) {
                res.send(200, {success: true});
              }
            });
          });

        });

      } else {
        req.flash('message', 'Invalid email or password!');
        res.send(200, {success: false});
      }

  });
 	}
};

exports.login = function(req, res) {
	console.log(req.body);

	console.log(req.body);

	var email = req.body.email.toLowerCase();
	var password = req.body.password;

	models.User.find({ 'email': email }).exec(function(err, users) {
		if (err) { console.log(err); res.send(500); }

		var success = false;
		var user_id = null;
		if (users.length >= 1) {
			var correctPassword = users[0].password;
			if (correctPassword == password) {
				success = true;
				user_id = users[0]._id;
			}
		}

		if (success) {
			res.cookie('user_id', user_id, {signed: true})
			console.log("user of user_id " + user_id + " signed in!");
			res.send(200, {success: true});
		} else {
			// req.flash('message', 'Invalid email or password!');
			res.send(200, {success: false});
		}
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