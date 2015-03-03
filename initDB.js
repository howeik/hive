
/*
  This script will initialize a local Mongo database
  on your machine so you can do development work.
  IMPORTANT: You should make sure the
      local_database_name
  variable matches its value in app.js  Otherwise, you'll have
  initialized the wrong database.
*/

var mongoose = require('mongoose');
var models   = require('./models');

// Connect to the Mongo database, whether locally or on Heroku
// MAKE SURE TO CHANGE THE NAME FROM 'lab7' TO ... IN OTHER PROJECTS
var local_database_name = 'hive';
var local_database_uri  = 'mongodb://localhost/' + local_database_name
var database_uri = process.env.MONGOLAB_URI || local_database_uri

mongoose.connect(database_uri);

var users_json = require('./users.json');
var classes_json = require('./classes.json');
// var user_classes_json = require('./user_classes.json');
var tasks_json = require('./tasks.json');
// var user_tasks_json = require('./user_tasks.json');

var to_save_count = users_json.length +
                    classes_json.length +
                    // user_classes_json.length +
                    tasks_json.length;
                    // user_tasks_json.length;

console.log(to_save_count);

var model = models.User;
var model_json = users_json;


save(models.User, users_json);
save(models.Class, classes_json);
save(models.Task, tasks_json);


function save(model, model_json) {
  model
    .find()
    .remove()
    .exec(function (err) {
      if(err) console.log(err);
      // loop over the projects, construct and save an object from each one
      // Note that we don't care what order these saves are happening in...
      for(var i=0; i<model_json.length; i++) {
        var json = model_json[i];
        var proj = new model(json);

        proj.save(function(err, proj) {
          if(err) console.log(err);
            to_save_count--;
            console.log(to_save_count + ' left to save');
            if(to_save_count == 0) {
              console.log('DONE. Added users to classes...');

              var howei = models.User.findOne({ email: 'hok022@ucsd.edu' }, function(err, user) {
                if (err) console.log(err);
                var cogs120 = models.Class.findOne({ name: 'COGS120' }, function(err, _class) {
                  if (err) console.log(err);
                  models.UserClasses.create({ user: user._id, class: _class._id }, function(err, userClass) {
                    if (err) console.log(err);
                    console.log("added hok022@ucsd.edu to COGS120");

                    // assign class ids to each task
                    models.Task.find().remove().find({}, function(err, tasks) {

                      var tasksToLink = tasks.length - 2;

                      tasks.forEach(function(task) {
                        models.Class.findOne({ 'name': task.class_name }, function(err, _class2) {
                          console.log("setting " + task.name + " to class id " + _class2.id);
                          task.class = _class2.id;
                          task.creator = user.id;
                          task.save();

                          if (task.class_name != "COGS120") {
                            models.UserTasks.create({ 'user': user.id, 'task': task.id, 'is_finished': false}, function(err, userTask) {
                              console.log("gave user howei task " + task.name);

                              tasksToLink--;
                              if (tasksToLink == 0) {
                                console.log("all done!");
                                mongoose.connection.close()
                              }

                            });
                          }

                        });
                      });




                    });

                  });
                });
              });
              // The script won't terminate until the 
              // connection to the database is closed
            }
          });
        }
      }
    );
}




