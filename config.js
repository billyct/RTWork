/**
 * RTWorker的配置文件
 */

exports.config = {
	name: 'RTWorker',
	description: 'RTWorker是一款用Node js 开发的钢筋翻样应用，用于系统管理建筑者的钢筋制作翻样',
	host: 'http://127.0.0.1/',
	db: 'mongodb://127.0.0.1/RTWorker',
	session_secret: 'RTWorker',
	auth_cookie_name: 'RTWorker',
	port: 8000,
	version: '0.0.1',

	// admins
	admins: {admin:true},
	//服务端钢筋类型对应的单位重的设置
	reinforcedTypeModel: {
		'6'  : 0.222,
		'6.5': 0.26,
		'8'  : 0.395,
		'10' : 0.617,
		'12' : 0.888,
		'14' : 1.21,
		'16' : 1.58,
		'18' : 1.998,
		'20' : 2.47,
		'22' : 3,
		'25' : 3.85
	}
};
