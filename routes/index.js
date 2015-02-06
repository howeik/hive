
/*
 * GET home page.
 */

exports.view = function(req, res){
  res.render('index');
};

exports.view_ionic = function(req, res) {
	res.render('index_ionic');
}