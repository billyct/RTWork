var models = require('../models'),
	Project = models.Project;

var sanitize = require('validator').sanitize;

var config = require('../config').config;

//var io = require('./sockets').io;

exports.create = function(req, res, next){
	var method = req.method.toLowerCase();
	if (method == 'get') {
		return;
	}

	if (method == 'post') {
		var project_name = sanitize(req.body.project_name).trim();
		Project.find({'$or':[
					{
						'name':project_name, 
						'user_id': req.session.user._id, 
						'engineering_id': req.session.user.engineering_working_id
					}
				]}, 
				function(err, project){
					if (err) return next(err);
					if (project.length > 0) {
						res.send({
									success: 'failed', 
									project_name: project_name,
									message: '同名项目已经存在，请取个其他的项目名'
								});
						return;
					}else{
						var project = new Project;
						project.name = project_name;
						project.user_id = req.session.user._id;
						project.engineering_id = req.session.user.engineering_working_id;
						project.save(function(err){
							if (err) {return next(err)};
							res.send({
								success: 'success',
								project_name: project_name,
								message: '创建项目成功'
							});

							return ;
						});
					}
		});
	}
}

exports.save = function(req, res , next){
	var method = req.method.toLowerCase();
	if (method == 'post') {
		var project_name = sanitize(req.body.project_name).trim();
		var project_old_name = sanitize(req.body.project_old_name).trim();
		Project.findOne(
			{
				name:project_name, 
				user_id: req.session.user._id, 
				engineering_id: req.session.user.engineering_working_id
			}, function(err, project){
				if (err) {next(err)};
				if (project) {
					res.send({
						success: 'failed',
						message: '已经有项目名叫'+project_name
					});
					return;
				}
			});
		Project.findOne({
			name: project_old_name,
			user_id: req.session.user._id,
			engineering_id: req.session.user.engineering_working_id
		}, function(err, project){
			if (err) {next(err)};
			if (project) {
				if (project_name == '') {
					res.send({
						success: 'failed',
						message: '请输入你的项目名'
					});
					return;
				}

				project.name = project_name;
				project.save(function(err){
					if (err) {next(err)};
					res.send({
						success: 'success',
						message: '编辑项目成功'
					});
					return;
				});
			}else {
				res.send({
					success: 'failed',
					message: '没有那样的工程项目，请联系管理员'
				});
				return;
			}
		})
	}
}


exports.delete = function(req, res, next){
	var method = req.method.toLowerCase();
	if (method == 'post') {
		var project_name = sanitize(req.body.project_name).trim();

		Project.findOne({
			name: project_name,
			user_id: req.session.user._id,
			engineering_id: req.session.user.engineering_working_id
		}, function(err, project){
			if (err) {return next(err)};
			if (project) {
				project.remove(function(err){
					if (err) {next(err)};
					res.send({
						success: 'success',
						message: '删除项目成功'
					});
					return;
				})
			}else{
				res.send({
					success: 'failed',
					message: '没有项目'+project_name
				});
				return;
			}
		});
	}
}


function get_all_projects(req, cb){
	if (req.session.user) {
		Project.find(
			{
				user_id:req.session.user._id, 
				engineering_id: req.session.user.engineering_working_id
			}, null, 
			{
				sort:['create_at', 'asc']
			}, 
			function(err, projects){
				if (err) {return cb(err, [])};
				return cb(err, projects);
			}
		);
	}
}

function get_project_id(req, project_name, cb){
	if (req.session.user) {
		Project.findOne({
			name: project_name,
			user_id: req.session.user._id,
			engineering_id: req.session.user.engineering_working_id
		}, function(err, project){
			if (err) {return next(err)};
			//console.log(project._id);
			return cb(err, project._id);
		});
	}
}

exports.get_all_projects = get_all_projects;
exports.get_project_id = get_project_id;
