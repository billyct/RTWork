var models = require('../models'),
	Work = models.Work,
	Project = models.Project;

var project_ctrl = require('./project');

var sanitize = require('validator').sanitize;

var config = require('../config').config;

var EventProxy = require('eventproxy').EventProxy;

//var io = require('./sockets').io;

exports.create = function(req, res, next){
	var method = req.method.toLowerCase();
	if (method == 'get') {
		return;
	}

	if (method == 'post') {
		var work_name = sanitize(req.body.work_name).trim();
		var project_name = sanitize(req.body.project_name).trim();

		var createWork = function(project_id){
			Work.find({'$or':[{'name':work_name,'user_id': req.session.user._id, 'project_id': project_id}]}, function(err, work){
				if (err) return next(err);
				if (work.length > 0) {
					res.send({
								success: 'failed', 
								work_name: work_name,
								message: '表堆名已经存在'
							});
					return;
				}else{
					if (!req.session.user) {
						res.send({
							success: 'failed',
							message: '你还没有登录'
						});
						return;
					}else{
						var work = new Work;
						work.name = work_name;
						work.user_id = req.session.user._id;
						work.project_id = project_id;
						work.save(function(err, work){
							if (err) {return next(err)};
							Project.findOne({_id: project_id}, function(err, project){
								if (err) {return next(err)};
								project.work_count += 1;
								project.save(function(err){
									if (err) {return next(err)};
								});
							});
							var result = {
								success: 'success',
								work_name: work_name,
								work_id: work._id,
								message: '表堆创建成功'
							};
							res.send(result);
							return;
						});
					}
				}
			});
		}

		var proxy = new EventProxy();
		proxy.assign('project_id', createWork);

		project_ctrl.get_project_id(req, project_name, function(err, project_id){
			if (err) {return next(err)};
			proxy.trigger('project_id', project_id);
		});
	}
}



exports.save = function(req, res, next){
	var method = req.method.toLowerCase();
	if (method == 'post') {
		var work_name = sanitize(req.body.work_name).trim();
		var work_old_name = sanitize(req.body.work_old_name).trim();
		var project_name = sanitize(req.body.project_name).trim();
		//var project_id = project_ctrl.get_project_id(req, project_name);

		var saveWork = function(project_id){
			Work.findOne({
				name: work_name,
				user_id: req.session.user._id,
				project_id: project_id
			}, function(err, work){
				if (err) {next(err);}
				if (work) {
					res.send({
						success: 'failed',
						message: '已经存在这样的表堆名的表堆'
					});
					return;
				}
			});

			Work.findOne({
				name: work_old_name,
				user_id: req.session.user._id,
				project_id: project_id
			}, function(err, work){
				if (err) {return next(err)};
				if (work) {
					if (work_name == '') {
						res.send({
							success: 'failed',
							message: '请输入表堆名'
						});
						return;
					};

					work.name = work_name;
					work.save(function(err){
						if (err) {return next(err)};
						res.send({
							success: 'success',
							message: '编辑成功'
						});
						return;
					})
				}else {
					res.send({
						success: 'failed',
						message: '没有表堆叫做'+ work_old_name
					});
					return;
				}
			});
		}

		var proxy = new EventProxy();
		proxy.assign('project_id', saveWork);

		project_ctrl.get_project_id(req, project_name, function(err, project_id){
			if (err) {return next(err)};
			proxy.trigger('project_id', project_id);
		});
	}
}


exports.delete = function(req, res, next){
	var method = req.method.toLowerCase();
	if (method == 'post') {

		var work_name = sanitize(req.body.work_name).trim();
		var project_name = sanitize(req.body.project_name).trim();


		var deleteWork = function(project_id){
			Work.findOne({
				name: work_name,
				user_id: req.session.user._id,
				project_id: project_id
			}, function(err, work){
				if (err) {return next(err)};
				if (work) {
					work.remove(function(err){
						if (err) {return next(err)};
						Project.findOne({_id: project_id}, function(err, project){
							if (err) {return next(err)};
							if (project.work_count > 0) {
								project.work_count --;
								project.save(function(err){
									if (err) {return next(err)};
								});
							}
							
						})
						res.send({
							success: 'success',
							message: '删除表堆成功'
						});
						return;
					});
				} else {
					res.send({
						success: 'failed',
						message: '没有表堆'+ work_name
					});
					return;
				}
			});
		}

		var proxy = new EventProxy();
		proxy.assign('project_id', deleteWork);

		project_ctrl.get_project_id(req, project_name, function(err, project_id){
			if (err) {return next(err)};
			proxy.trigger('project_id', project_id);
		});
	}
}

exports.main = function(req, res, next){
	var method = req.method.toLowerCase();

	if (method == 'get') {
		var project_name = sanitize(req.query.project_name).trim();
		// var data = {};
		// var steps = ['works', 'project_id']
		
		var render = function(project_id){
			if (req.session.user) {
				Work.find({
					user_id: req.session.user._id,
					project_id: project_id
				}, null, {
					sort:['create_at', 'asc']
				}, function(err, works){
					if (err) {return next(err)};
					res.render('work/main', {config:config, works:works, project_name: project_name, layout:false});
					return;
				});
			}
		}

		var proxy = new EventProxy();
		proxy.assign('project_id', render);

		project_ctrl.get_project_id(req, project_name, function(err, project_id){
			if (err) {return next(err)};
			proxy.trigger('project_id', project_id);
		});
	}
}





function get_all_works(req, project_id){
	if (req.session.user) {
		Work.find({
			user_id: req.session.user._id,
			project_id: project_id
		}, [], {
			sort:['create_at', 'asc']
		}, function(err, works){
			if (err) {return next(err)};
			return works;
		});
	}
}

exports.get_all_works = get_all_works;
