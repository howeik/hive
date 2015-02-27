var models = require('../models');

exports.view = function(req, res){
  res.render('signup');
};

exports.adduser = function(req, res){
  console.log(req.body);

  	var name = req.body.name;
  	var email = req.body.email;
  	var password = req.body.password;

  	console.log(name);
  	console.log(email);
  	console.log(password);

  	var newUser = new models.User({'name':name, 'email':email, 'password':password});
  	newUser.save(afterSave);

  	function afterSave(err) {
    	if (err) { console.log(err); res.send(500); return;}
    	//res.redirect('login');
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
      res.redirect('/');
    } else {
      req.flash('message', 'Invalid email or password!');
      res.redirect('login');
    }
  });
 	}
};

// exports.auth = function(req, res) {
//   console.log(req.body);

//   var email = req.body.email.toLowerCase();
//   var password = req.body.password;

//   models.User.find({ 'email': email }).exec(function(err, users) {
//     if (err) { console.log(err); res.send(500); }

//     var success = false;
//     var user_id = null;
//     if (users.length >= 1) {
//       var correctPassword = users[0].password;
//       if (correctPassword == password) {
//         success = true;
//         user_id = users[0]._id;
//       }
//     }

//     if (success) {
//       res.cookie('user_id', user_id, {signed: true})
//       console.log("user of user_id " + user_id + " signed in!");
//       res.redirect('/');
//     } else {
//       req.flash('message', 'Invalid email or password!');
//       res.redirect('login');
//     }
//   });
// };