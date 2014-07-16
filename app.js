
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , config = require('./config').config;

var app = module.exports = express.createServer();

var static_dir = __dirname + '/public';

// Configuration

app.configure(function(){
	//使用ejs来处理动态数据
  app.set('view engine', 'html');
  app.set('views', __dirname + '/views');
  app.register('.html',require('ejs'));

  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({
    	secret: config.session_secret,
  }));

  app.use(app.router);
});

app.helpers({
	config: config
});

app.configure('development', function(){
	app.use(express.static(static_dir));
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
	var one_year=1000*60*60*24*365;
	app.use(express.static(static_dir,{maxAge:one_year}));
	app.use(express.errorHandler());
	app.set('view cache',true);
});



// Routes
//所有的路由对应的路由控制

//登录，注册，退出的路由控制
app.get('/', routes.index);
app.get('/signin', routes.signin);
app.get('/signup', routes.signup);
app.get('/signout', routes.signout);
app.post('/signin', routes.signin);
app.post('/signup', routes.signup);

//工程的路由控制
app.post('/engineering/create', routes.create_engineering);
app.post('/engineering/save', routes.save_engineering);
app.post('/engineering/delete', routes.delete_engineering);

//项目的路由控制
app.post('/project/create', routes.create_project);
app.post('/project/save', routes.save_project);
app.post('/project/delete', routes.delete_project);
//app.get('/*', routes.error);

//表堆的路由控制
app.post('/work/create', routes.create_work);
app.post('/work/save', routes.save_work);
app.post('/work/delete', routes.delete_work);
app.get('/work/main', routes.work_main);

//表的路由控制
app.get('/table/main', routes.table_main);
app.post('/table/create', routes.create_table);
app.post('/table/save', routes.save_table);
app.post('/table/delete', routes.delete_table);
app.post('/table/search', routes.search_table);

//用户路由控制
app.post('/user/set_engineering', routes.set_engineering);

//for chat room
app.get('/chat', routes.chat_room);
//app.post('/offline', routes.offline);
app.post('/addFriend', routes.addFriend);
app.post('/verifyFriend', routes.verifyFriend);
app.post('/cancelVerifyFriend', routes.cancelVerifyFriend);

app.listen(config.port);

var chatSocket = require('./libs/chatSocket').chat_socket;
var usernames = {};
chatSocket(usernames, app);


console.log('good luck');
//console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
