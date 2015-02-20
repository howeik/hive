
/*
 * GET home page.
 */

exports.view = function(req, res){
  res.render('index');
};

exports.view_ionic = function(req, res) {
	if (req.signedCookies.user_id == undefined) {
		res.redirect('login');
	}

	res.render('index_ionic');
}