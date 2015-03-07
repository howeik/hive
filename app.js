require('newrelic');

var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars')
var mongoose = require('mongoose');
var flash = require('connect-flash');

var index = require('./routes/index');
var login = require('./routes/login');
var signup = require('./routes/signup');
var addclass = require('./routes/addclass');

var user_api = require('./routes/user_api');
var class_api = require('./routes/class_api');
var task_api = require('./routes/task_api');

var welcome = require('./routes/welcome');


// Connect to the Mongo database, whether locally or on Heroku
// MAKE SURE TO CHANGE THE NAME FROM 'lab7' TO ... IN OTHER PROJECTS
var local_database_name = 'hive';
var local_database_uri  = 'mongodb://localhost/' + local_database_name
var database_uri = process.env.MONGOLAB_URI || local_database_uri
mongoose.connect(database_uri);

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('hive_28349983242390283293'));
app.use(express.session());
app.use(flash());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.use(express.favicon("public/images/favicon.ico")); 

// Add routes here
app.get('/', index.view_ionic);
// app.get('/login', login.view);
// app.post('/login', login.auth);
app.get('/logout', login.logout);
app.post('/api/user/login', user_api.login);
app.post('/api/user/signup', user_api.adduser);

app.get('/api/user/declined', user_api.declined);
app.post('/api/user/decline', user_api.decline);

app.get('/api/user/all', user_api.all);
app.get('/signup', signup.view);
app.post('/signup', signup.adduser);
app.get('/api/class/all', class_api.all);
app.get('/api/user/me', user_api.me);
app.get('/api/class/enrolled', class_api.enrolled);
app.post('/api/class/add', class_api.add);
app.post('/api/class/delete', class_api.delete);
app.get('/api/class/search', class_api.search);
app.get('/api/task/all', task_api.all);
app.get('/api/task/shared', task_api.shared);
app.get('/api/task/super_all', task_api.super_all);

app.get('/api/task/detail/:task_id', task_api.details);
app.get('/api/task/shareCount/:task_id', task_api.shareCount);

app.post('/api/task/delete', task_api.delete);


app.post('/api/task/create', task_api.create);
app.post('/api/task/add', task_api.add);
app.post('/api/task/update', task_api.update);
app.get('/addclass', addclass.addclass);

// alternative design
app.get('/welcome/', function(req, res) { res.redirect('/welcome'); });

app.get('/welcome', welcome.welcome);
app.get('/welcome/login', welcome.login);
app.get('/welcome/signup', welcome.signup);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});