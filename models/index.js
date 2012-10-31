//这是一个模型层的路口文件，所有的模型类都可以在这个文件中注册，并在其他控制层中访问到
var mongoose = require('mongoose'),
	config= require('../config').config;

//使用mongoose来连接数据库
mongoose.connect(config.db, function(err){
	if(err){
		console.log('connect to db error: ' + err.message);
		process.exit(1);
	}
});

// models
require('./engineering');
require('./project');
require('./work');
//require('./work_project');
require('./table');
require('./user');

exports.Engineering = mongoose.model('Engineering');
exports.Project = mongoose.model('Project');
exports.Work = mongoose.model('Work');
//exports.WorkProject = mongoose.model('WorkProject');
exports.Table = mongoose.model('Table');
exports.User = mongoose.model('User');