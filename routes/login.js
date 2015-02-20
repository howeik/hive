exports.view = function(req, res){
  res.render('login');
};

exports.auth = function(req, res) {
	res.respond(200);
}