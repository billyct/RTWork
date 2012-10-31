var models = require('../models'),
	Engineering = models.Engineering,
	User = models.User;

var sanitize = require('validator').sanitize;

var config = require('../config').config;
var EventProxy = require('eventproxy').EventProxy;

//var io = require('./sockets').io;
//增加工程
exports.create = function(req, res, next){
	var method = req.method.toLowerCase();
	if (method == 'get') {
		return;
	}

	if (method == 'post') {
		var engineering_name = sanitize(req.body.engineering_name).trim();
		//查找是否已经存在该用户创建工程的工程名，如果已经存在就返回创建失败
		Engineering.find({'$or':[{'name':engineering_name, 'user_id': req.session.user._id}]}, function(err, engineering){
			if (err) return next(err);
			if (engineering.length > 0) {
				var result = {
								success: 'failed', 
								engineering_name: engineering_name,
								message: '您已经创建过名字为的'+engineering_name+'工程'
							};
				res.send(result);
				return;
			}else{
				if (!req.session.user) {
					res.send({
						success: 'failed',
						message: 'you have not login'
					});
					return;
				}else{
					//工程添加成功操作
					var engineering = new Engineering;
					engineering.name = engineering_name;
					//console.log(req.session.user._id);
					engineering.user_id = req.session.user._id;
					engineering.save(function(err){
						if (err) {return next(err)};

						var result = {
										success: 'success', 
										engineering_name: engineering_name,
										message: '创建成功'
									};
						res.send(result);
						return;
					});
				}
			}
		});
	}
}
//保存工程的修改
exports.save = function(req, res, next){
	var method = req.method.toLowerCase();
	if (method == 'post') {
		var engineering_old_name = sanitize(req.body.engineering_old_name).trim();
		var engineering_name = sanitize(req.body.engineering_name).trim();
		Engineering.findOne({name: engineering_name, user_id:req.session.user._id}, function(err, engineering){
			if (err) {return next(err)};
			if (engineering) {
				res.send({
					success: 'failed',
					message: '你不能使用'+engineering_name+'来进行保存，'+engineering_name+'已经存在'
				});
				return;
			}
		});
		Engineering.findOne({name: engineering_old_name, user_id:req.session.user._id}, function(err, engineering){
			if (err) {return next(err)};
			if (engineering) {
				if (engineering_name == '') {
					res.send({
						success: 'failed',
						message: '请填写你的工程名'
					});
					return;
				}

				engineering.name = engineering_name;
				engineering.save(function(err){
					if (err) {return next(err)};
					res.send({
						success: 'success',
						message: '保存成功'
					});
					return;
				});
			}else{
				res.send({
					success: 'failed',
					message: '不存在这个工程'
				});
				return;
			}
		});
	}
}

//删除对应的工程
exports.delete = function(req, res, next){
	var method = req.method.toLowerCase();
	if (method == 'post') {
		var engineering_name = sanitize(req.body.engineering_name).trim();

		Engineering.findOne({name: engineering_name, user_id:req.session.user._id}, function(err, engineering){
			if (err) {return next(err)};
			if (engineering) {
				engineering.remove(function(err){
					if (err) {next(err)};
					res.send({
						success:'success',
						message: '删除成功'
					});
					return;
				});

				//also delete the projeccts in the engineering 
			}else {
				res.send({
					success: 'failed',
					message: '没有工程叫做'+engineering_name
				});
				return;
			}
		});
	}
}




//返回登录用户的所有工程
function get_all_engineerings(req, cb){
	if (req.session.user) {
		Engineering.find({user_id:req.session.user._id}, null, {sort:['create_at', 'asc']}, function(err, engineerings){
			if (err) {return cb(err, [])};
			return cb(err, engineerings);
		});
	}
}

//返回登录用户的正在工作的工程
function get_engineering_working(req, cb){
	if (req.session.user) {
		Engineering.findOne({_id:req.session.user.engineering_working_id}, function(err, engineering){
			if (err) {return cb(err, [])};
			return cb(err, engineering);
		});
	}
}

exports.get_engineering_working = get_engineering_working;
exports.get_all_engineerings = get_all_engineerings;
