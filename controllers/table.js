var models = require('../models'),
	Table = models.Table;

var work_ctrl = require('./work');

var sanitize = require('validator').sanitize;

var config = require('../config').config;

var EventProxy = require('eventproxy').EventProxy;

//var io = require('./sockets').io;

exports.create = function(req, res, next){
	var method = req.method.toLowerCase();
	if (method == 'post') {
		var work_id = sanitize(req.body.work_id).trim();
		var component = sanitize(req.body.component).trim().toUpperCase();
		var shape = sanitize(req.body.shape).trim();
		var reinforcedType = sanitize(req.body.reinforcedType).trim();
		var sum = sanitize(req.body.sum).trim();
		var shapeLength = sanitize(req.body.shapeLength).trim();
		var totalLength = sanitize(req.body.totalLength).trim();
		var unitWeight = sanitize(req.body.unitWeight).trim();
		var totalWeight = sanitize(req.body.totalWeight).trim();
		var remark = sanitize(req.body.remark).trim();
		if (!req.session.user) {
			res.send({
				success: 'failed',
				message: '你还没有登录'
			});
			return;
		}else{
			var table = new Table;
			table.user_id = req.session.user._id;
			table.work_id = work_id;
			table.component = component;
			table.shape = shape;
			table.reinforcedType = reinforcedType;
			table.sum = sum;
			table.shapeLength = shapeLength;
			table.totalLength = totalLength;
			table.unitWeight = unitWeight;
			table.totalWeight = totalWeight;
			table.remark = remark;
			table.save(function(err, table){
				if (err) {return next(err)};
				var result = {
					success: 'success',
					table_id: table._id,
					message: '表格创建成功'
				};
				res.send(result);
				return;
			});
		}
	}
}



exports.save = function(req, res, next){
	var method = req.method.toLowerCase();
	function fomatFloat(src,pos){
		return Math.round(src*Math.pow(10, pos))/Math.pow(10, pos);
	}
	if (method == 'post') {
		var id = sanitize(req.body.id).trim();
		var pos = sanitize(req.body.pos).trim();
		var value = sanitize(req.body.value).trim();

		Table.findOne({
			_id: id,
			user_id: req.session.user._id
		}, function(err, table){
			if (err) {return next(err)};
			if (table) {
				if (value == '') {
					res.send({
						success: 'failed',
						message: '不能为空'
					});
					return;
				}

				switch(parseInt(pos)){
					case 0:
						table.component = value;
						//console.log('component');
						break;
					case 1:
						table.shape = value;
						table.shapeLength = parseFloat(eval(value));
						table.totalLength = table.shapeLength*table.sum;
						table.totalWeight = fomatFloat(table.totalLength*table.unitWeight,2);
						//console.log('shape');
						break;
					case 2:
						table.reinforcedType = value;
						var reinforcedNum = value.match(/[\d\.]+/);
						table.unitWeight = config.reinforcedTypeModel[reinforcedNum];
						table.totalWeight = fomatFloat(table.totalLength*table.unitWeight,2);
						//console.log('type');
						break;
					case 3:
						table.sum = value;
						table.totalLength = table.shapeLength*table.sum;
						table.totalWeight = fomatFloat(table.totalLength*table.unitWeight,2);
						//console.log('sum');
						break;
					case 8:
						table.remark = value;
						break;
				}
				table.save(function(err, table){
					if (err) {return next(err)};
					res.send({
						success: 'success',
						value: [table.component, table.shape, table.reinforcedType, table.sum, table.shapeLength, table.totalLength, table.unitWeight, table.totalWeight, table.remark],
						message: '修改成功'
					});
					return;
				});
			}else{
				res.send({
					success: 'failed',
					message: '不能找到那个表，请联系管理员'
				});
				return;
			}
		});
	}
}


exports.delete = function(req, res, next){
	var method = req.method.toLowerCase();
	if (method == 'post') {
		var id = sanitize(req.body.id).trim();
		Table.findOne({
			_id: id,
			user_id: req.session.user._id
		}, function(err, table){
			if (err) {return next(err)};
			if (table) {
				table.remove(function(err){
					if (err) {return next(err)};
					res.send({
						success: 'success',
						message: '删除表成功'
					});
					return;
				});
			} else {
				res.send({
					success: 'failed',
					message: '不能找到你想要删除的表，请联系管理员'
				});
				return;
			}
		})
	}
}

exports.main = function(req, res, next){
	var method = req.method.toLowerCase();

	if (method == 'get') {
		var work_id = sanitize(req.query.work_id).trim();
		//var work_name = sanitize(req.query.work_name).trim();
		if (req.session.user) {
			Table.find({
				user_id: req.session.user._id,
				work_id: work_id
			}, null, {
				sort:['create_at', 'asc']
			}, function(err, tables){
				if (err) {return next(err)};
				res.render('table/main', {config:config, tables:tables, work_id:work_id, layout:false});
				return;
			});
		}

	}
}


exports.search = function(req, res, next){
	var method = req.method.toLowerCase();
	if (method == 'get') {

	}
	if (method == 'post') {
		var works = req.body.works;
		//console.log(works);

		Table.find({
			user_id: req.session.user._id,
			work_id: {$in:works}
		}, function(err, works){
			if (err) {return next(err)};
			if (works) {
				var componentData = {};
				var reinforcedData = {};
				for (var i = works.length - 1; i >= 0; i--) {
					if(componentData[works[i].component] == undefined){
						componentData[works[i].component] = 0;
					}
					componentData[works[i].component] += works[i].totalWeight;

					if (reinforcedData[works[i].reinforcedType] == undefined) {
						reinforcedData[works[i].reinforcedType] = 0;
					}
					reinforcedData[works[i].reinforcedType] += works[i].totalWeight;
				};
				res.send({
					success: 'success',
					componentData:componentData, 
					reinforcedData:reinforcedData
				});
				return;
			}
		});

	};
}
