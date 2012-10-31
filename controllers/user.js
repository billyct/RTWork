var models = require('../models'),
	User = models.User,
	Engineering = models.Engineering;

var sanitize = require('validator').sanitize;

var config = require('../config').config;

var arrayLib = require('../libs/arrayLib');



exports.set_engineering_working = function(req, res, next){
	var method = req.method.toLowerCase();
	if (method == 'post') {
		var engineering_working_name = sanitize(req.body.engineering_working_name).trim();
		var engineering_working_id;
		Engineering.findOne({name: engineering_working_name}, function(err, engineering){
			if (err) {return next(err)};
			if (engineering) {
				engineering_working_id = engineering._id;
			}else{
				res.send({
					success: 'failed',
					message: '没有那个工程'
				});
				return;
			}
		});
		User.findOne({_id: req.session.user._id}, function(err, user){
			if (err) {return next(err)};
			if (user) {
				user.engineering_working_id = engineering_working_id;
				user.save(function(err){
					if (err) { return };
					res.send({
						success: 'success',
						message: '设置成功'
					});
					req.session.user = user;
					return;
				});
			}else{
				res.send({
					success: 'failed',
					message: '没有用户'
				});
				return;
			}
		});
	}
}

// exports.offline = function (req, res, next){
// 	if (req.session.user) {
// 		//for chat_room
// 		User.findOne({'name':req.session.user.name}, function(err, user){
// 			user.online = 0;
// 			user.save(function(err){
// 				if (err) {return next(err)};
// 				var method = req.method.toLowerCase();
// 				if (method == 'post') {
// 					res.send({
// 						success: 'success',
// 						message: 'logout!!'
// 					});
// 				}else{
// 					return;
// 				}
// 			});
// 		});
// 	}
// }

exports.addFriend = function (req, res, next){
	var method = req.method.toLowerCase();
	if (method == 'post' && req.session.user) {
		var friend_name = sanitize(req.body.friend_name).trim();

		User.findOne({_id: req.session.user._id}, {verifyFriends: 1, unVerifyFriends:1, name:1}, function(err, user){
			User.findOne({name: friend_name}, function(err, friend_user){
				if (err) {return next(err)};
				if (friend_user) {
					if (!arrayLib.in_array(friend_user.name, user.unVerifyFriends) && 
						!arrayLib.in_array(friend_user.name, user.verifyFriends)) {

						User.update(
									{ _id: req.session.user._id }, 
									{$push : { unVerifyFriends : friend_name} },
									function(err){
										if (err) {return next(err)};
										User.update(
											{_id: friend_user._id},
											{$push : { forVerifyFriends : user.name}},
											function(err){
												if (err) {return next(err)};
												res.send({
													success: 'success',
													message: 'your message is sended'
												});
											});
									});
					}else{
						res.send({
							success: 'failed',
							message: 'you have add the friend '+friend_name
						});
					}
				} else {
					res.send({
							success: 'failed',
							message: 'not exit'+friend_name
						});
				}
			});
		});
	}
}


exports.verifyFriend = function(req, res, next){
	var method = req.method.toLowerCase();
	if (method == 'post' && req.session.user) {
		var friend_name = sanitize(req.body.friend_name).trim();
		var user = req.session.user;
		User.update(
			{ _id: user._id }, 
			{$push : { verifyFriends : friend_name}, $pull: {forVerifyFriends: friend_name} },
			function(err){
				if (err) {return next(err)};
				User.update(
					{name: friend_name},
					{$push : { verifyFriends : user.name}, $pull: {unVerifyFriends: user.name}},
					function(err){
						if (err) {return next(err)};
						res.send({
							success: 'success',
							message: 'you verifyFriends success'
						});
					});
			});
	}
}

exports.cancelVerifyFriend = function(req, res, next){
	var method = req.method.toLowerCase();
	if (method == 'post' && req.session.user) {
		var friend_name = sanitize(req.body.friend_name).trim();
		var user = req.session.user;
		User.update(
			{ _id: user._id }, 
			{$pull: {forVerifyFriends: friend_name} },
			function(err){
				if (err) {return next(err)};
				User.update(
					{name: friend_name},
					{$pull: {unVerifyFriends: user.name}},
					function(err){
						if (err) {return next(err)};
						res.send({
							success: 'success',
							message: 'you CancelVerifyFriends success'
						});
					});
			});
	}
}


function get_friends(req,cb){
	if (req.session.user) {
		User.findOne(
			{_id: req.session.user._id}, 
			{verifyFriends:1, unVerifyFriends:1, forVerifyFriends:1}, 
			function(err, friends){
				if (err) { return next(err)};

				if (!friends.verifyFriends) {friends.verifyFriends = []};
				if (!friends.unVerifyFriends) {friends.unVerifyFriends = []};
				if (!friends.forVerifyFriends) {friends.forVerifyFriends = []};

				return cb(err, friends);
			});
	}
}

exports.get_friends = get_friends;




// function get_online_users(req, cb){
// 	if (req.session.user) {
// 		User.find(
// 			{online:1, name:{$in:req.session.user.verifyFriends}},
// 			{name:1}, 
// 			function(err, users){
// 				if (err) {return next(err)};
// 				return cb(err, users)
// 			}
// 		);
// 	}
// }



// exports.get_online_users = get_online_users;



