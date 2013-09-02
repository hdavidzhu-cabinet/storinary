/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.login = function(req, res) {
    req.session.url = '/fetch';
    res.render('login', {title: "Sign In"});
};

exports.search = function(req, res) {
	var data = req.body['query'];
	data = data.toUpperCase();
	res.send({"data":JSON.stringify(data)});
};