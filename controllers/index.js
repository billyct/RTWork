var engineering_ctrl = require('./engineering');
var project_ctrl = require('./project');
var work_ctrl = require('./work');

var site_ctrl = require('./site');
var config = require('../config').config;

var EventProxy = require('eventproxy').EventProxy;

//这是一个主页的控制器，判断是否登录用户，如果登录用户则返回操作页面，如果不是则返回登录界面
exports.index = function(req, res){
	if (req.session.user) {
		var render = function(engineerings, engineering_working, projects){
			var all_engineerings = engineerings.slice(0);
			res.render('index', 
				{ 
					config: config, 
					user:req.session.user, 
					engineerings:all_engineerings, 
					engineering_working:engineering_working,
					projects: projects
					//works: works
				});
		}
		
		//使用EventProxy来加载其他控制器返回的一些信息
		var proxy = new EventProxy();
		proxy.assign('engineerings', 'engineering_working', 'projects', render);

		engineering_ctrl.get_all_engineerings(req, function(err, engineerings){
			if (err) {return next(err)};
			proxy.trigger('engineerings', engineerings);
		});

		engineering_ctrl.get_engineering_working(req, function(err, engineering_working){
			if (err) {return next(err)};
			proxy.trigger('engineering_working', engineering_working);
		});

		project_ctrl.get_all_projects(req, function(err, projects){
			if (err) {return next(err)};
			proxy.trigger('projects', projects);
		});

		// work_ctrl.get_all_works(req, function(err, works){
		// 	if (err) {return next(err)};
		// 	proxy.trigger('works', works);
		// });



	}else{
		res.render('index', { config: config, user:req.session.user});
	}

	
}

exports.error = function(req, res){
	res.render('404', { config: config });
}