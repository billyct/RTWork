// var models = require('../models'),
// 	User = models.User;

var config = require('../config').config;

exports.slidebar = function(req, res, next){
	res.render('site/slidebar', {layout:false, user:req.session.user});
	return;
}