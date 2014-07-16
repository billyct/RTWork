var models = require('../models'),
	User = models.User;

var user_ctrl = require('./user');
var check = require('validator').check,
	sanitize = require('validator').sanitize;

var crypto = require('crypto');
var config = require('../config').config;

//var io = require('./sockets').io;


exports.signup = function(req, res, next){
	var method = req.method.toLowerCase();
	if (method == 'get') {
		res.render('sign/signup', {layout: false, user:req.session.user});
		return;
	}

	if (method == 'post') {

		var name = sanitize(req.body.username).trim();
		//name = name.toLowerCase();
		var pass = sanitize(req.body.password).trim();
		pass = sanitize(pass).xss();
		var email = sanitize(req.body.email).trim();
		email = email.toLowerCase();
		email = sanitize(email).xss();

		//there may be a server check

		User.find({'$or':[{'name':name}, {'email':email}]}, function(err, users){
			if (err) return next(err);
			if (users.length > 0){

				var result = {
								success: 'failed',
								name:name,
								message: '用户名或者Email已经存在'
							};
				res.send(result);
				return;
			}else{
				pass = md5(pass);

				var user = new User();
				user.name = name;
				user.email = email;
				user.pass = pass;
				user.save(function(err, user){
					if(err) return next(err);

					var result = {
									success: 'success',
									name:name,
									message: '注册成功'
								};
					res.send(result);
					req.session.user = user;
					return;
				});
			}
		})

	}
}


exports.signin = function(req, res, next){
	var method = req.method.toLowerCase();
	if (method == 'get') {
		res.render('sign/signin', {layout: false});
		return;
	}

	if (method == 'post') {
		var name = sanitize(req.body.username).trim();
		var pass = sanitize(req.body.password).trim();

		User.findOne({'name':name}, {verifyFriends:0, unVerifyFriends:0, forVerifyFriends:0},function(err, user){
			if (err) {return next(err)};
			if (!user){
				result = {
							success: 'failed',
							name:name,
							message: '没有用户名为的'+name+'用户'
						};
				res.send(result);
				return;
			}

			pass = md5(pass);
			if (pass != user.pass) {
				var result = {
								success: 'failed',
								name:name,
								message: '密码不正确'
							};
				res.send(result);
				return;
			};
			//for chat room
			// user.online = 1;
			// user.save();

			req.session.user = user;
			console.log(req.session.user);

			var result = {
							success: 'success',
							name:name,
							message: '登录成功',
							user: user
						};
			res.send(result);
			return;
		});
	}
}

exports.signout = function(req, res, next){
	//for chat_room
	//user_ctrl.offline(req, res, next);

	req.session.destroy();
	res.clearCookie(config.auth_cookie_name, {path:'/'});
	res.redirect('/');
}


//auth_user_middleware
exports.auth_user = function(req, res, next){
	if (req.session.user) {
		if (config.admins[req.session.user.name]) {
			req.session.user.is_admin = true;
		}
	}else{
		var cookie = req.cookies[config.auth_cookie_name];
		if (!cookie) {return next()};

		var auth_token = decrypt(cookie, config.session_secret);
		var auth = auth_token.split('\t');
		var user_id = auth[0];
		User.findOne({_id:user_id}, function(err, user){
			if (err) {return next(err)};
			if (user) {
				if (config.admins[user.name]) {
					user.is_admin = true;
				}
				req.session.user = user;
				//log('xxx');
			}else{
				return next();
			}
		})
	}
}


//private
function gen_session(user, res){
	var auth_token = encrypt(user._id + '\t' + user.name + '\t' + user.pass +
						'\t' + user.email, config.session_secret);
	res.cookie(config.auth_cookie_name, auth_token, {path: '/', maxAge: 1000*60*60*24*7});//cookie for one week
}

function decrypt(str, secret){
	var decipher = crypto.createDecipher('aes192', secret);
	var dec = decipher.update(str, 'hex', 'utf8');
	dec += decipher.final('utf8');
	return dec;
}

function encrypt(str, secret){
	var cipher = crypto.createCipher('aes192', secret);
	var enc = cipher.update(str, 'utf8', 'hex');
	enc += cipher.final('hex');
	return enc;
}

function md5(str){
	var md5sum = crypto.createHash('md5');
	md5sum.update(str);
	str = md5sum.digest('hex');
	return str;
}
