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
    	res.redirect('login');
 	}
};