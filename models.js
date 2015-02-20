
// this is probably really bad since this was designed with SQL in mind

var Mongoose = require('mongoose');

var UserSchema = new Mongoose.Schema({
  "name": String,
  "email": String,
  "password": String
});

var ClassSchema = new Mongoose.Schema({
  "name": String
});

var UserClassesSchema = new Mongoose.Schema({
  "user": { type: Number, ref: "User" },
  "class": { type: Number, ref: "Class" }
});

var TaskSchema = new Mongoose.Schema({
  "name": String,
  "description": String,
  "due_date": String,
  "is_shared": Boolean,
  "class": { type: Number, ref: "Class" },
  "class_name": String,
  "is_endorsed": Boolean
});

var UserTasksSchema = new Mongoose.Schema({
  "user": { type: Number, ref: "User" },
  "task": { type: Number, ref: "Task" },
  "is_finished": Boolean
});

exports.User = Mongoose.model('User', UserSchema);
exports.Class = Mongoose.model('Class', ClassSchema);
exports.UserClasses = Mongoose.model('UserClasses', UserClassesSchema);
exports.Task = Mongoose.model('Task', TaskSchema);
exports.UserTasks = Mongoose.model('UserTasks', UserTasksSchema);
