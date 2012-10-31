var models = require('../models'),
	User = models.User;

var user_ctrl = require('./user');

//var sanitize = require('validator').sanitize;

var config = require('../config').config;


var EventProxy = require('eventproxy').EventProxy;



exports.chat_room = function(req, res, next){
	var method = req.method.toLowerCase();
	if (method == 'get') {
		if (req.session.user) {
			var render = function(friends){
				//console.log(friends);

				res.render('chat/main',
					{ 
						config: config, 
						user:req.session.user,
						verifyFriends: friends.verifyFriends,
						unVerifyFriends: friends.unVerifyFriends,
						forVerifyFriends: friends.forVerifyFriends
					});
			 }

			var proxy = new EventProxy();
			proxy.assign('friends', render);

			user_ctrl.get_friends(req, function(err, friends){
				if (err) {return next(err)};
				proxy.trigger('friends', friends);
			});

			// user_ctrl.get_online_users(req, function(err, users){
			// 	if (err) {return next(err)};
			// 	proxy.trigger('online_users', users);
			// });
		}
	}
	if (method == 'post') {
	}
}
